import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { validatePassword } from "@/lib/password-validation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (meaning we came from the recovery link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError("Password does not meet all requirements.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">New Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        {success ? (
          <CardContent>
            <Alert className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/50">
              <AlertDescription>
                Password updated successfully. Redirecting to login...
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleReset}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordStrengthIndicator password={password} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
