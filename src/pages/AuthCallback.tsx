import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const type = searchParams.get("type");

      if (event === "SIGNED_IN") {
        if (type === "recovery") {
          navigate("/reset-password");
        } else {
          navigate("/");
        }
      } else if (event === "INITIAL_SESSION") {
        // Handle cases where the session is already established
        if (session) {
          if (type === "recovery") {
            navigate("/reset-password");
          } else {
            navigate("/");
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center animate-fade-in">
        <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait a moment while we set things up.</p>
      </div>
    </div>
  );
}
