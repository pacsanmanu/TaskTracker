import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (resetError) throw resetError;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error sending recovery email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        {success ? (
          <CardContent className="space-y-4">
            <Alert className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/50">
              <AlertDescription>
                If an account exists for <strong>{email}</strong>, you will receive an email with instructions shortly.
              </AlertDescription>
            </Alert>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/login">Back to Login</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
