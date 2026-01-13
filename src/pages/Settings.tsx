import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";

export default function Settings() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);

  useEffect(() => {
    checkMfaStatus();
  }, []);

  const checkMfaStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      
      const activeFactor = data.all.find(f => f.status === "verified");
      setMfaEnabled(!!activeFactor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEnrollment = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const existingFactor = factors?.all.find(
        (f) => f.friendly_name === "My Authenticator"
      );

      if (existingFactor) {
        await supabase.auth.mfa.unenroll({ factorId: existingFactor.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "Taskator",
        friendlyName: "My Authenticator"
      });

      if (error) throw error;

      setFactorId(data.id);
      setQrCodeUrl(data.totp.uri);
      setShowEnroll(true);
    } catch (err: any) {
      setError(err.message || "Error initializing 2FA. Please ensure your email is confirmed.");
    } finally {
      setLoading(false);
    }
  };

  const verifyEnrollment = async () => {
    if (!factorId) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode
      });

      if (error) throw error;

      setMfaEnabled(true);
      setShowEnroll(false);
      setQrCodeUrl(null);
      setVerifyCode("");
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const disableMfa = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const factor = data.all.find(f => f.status === "verified");
      if (factor) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
          factorId: factor.id
        });
        if (unenrollError) throw unenrollError;
      }

      setMfaEnabled(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <Card className="overflow-hidden border-muted/40 shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security and two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert variant="destructive" className="animate-slide-up">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Two-Factor Authentication (2FA)</Label>
                <p className="text-sm text-muted-foreground max-w-[400px]">
                  Add an extra layer of security using an authenticator app (TOTP).
                </p>
              </div>
              <div className="flex items-center gap-3">
                {loading && !showEnroll && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
                <Switch 
                  checked={mfaEnabled || showEnroll} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      startEnrollment();
                    } else {
                      if (showEnroll) {
                        setShowEnroll(false);
                        setQrCodeUrl(null);
                      } else if (confirm("Are you sure you want to disable 2FA?")) {
                        disableMfa();
                      }
                    }
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {showEnroll && qrCodeUrl && (
              <div className="border rounded-2xl p-6 space-y-6 bg-muted/30 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Configure Authenticator</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                </div>
                
                <div className="flex justify-center p-6 bg-white rounded-2xl shadow-inner mx-auto w-fit">
                  <QRCodeSVG value={qrCodeUrl} size={200} level="M" includeMargin />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verify-code" className="text-sm font-medium">
                      Verification Code
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id="verify-code"
                        placeholder="000000"
                        value={verifyCode}
                        maxLength={6}
                        className="text-center text-lg tracking-[0.5em] font-mono h-12"
                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                      />
                      <Button 
                        onClick={verifyEnrollment} 
                        disabled={loading || verifyCode.length !== 6}
                        className="h-12 px-6 font-bold"
                      >
                        {loading ? "..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full h-11 border-dashed" onClick={() => {
                    setShowEnroll(false);
                    setQrCodeUrl(null);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
