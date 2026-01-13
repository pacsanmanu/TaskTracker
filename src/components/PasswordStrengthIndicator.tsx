import { validatePassword } from "@/lib/password-validation";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const result = validatePassword(password);
  
  const getProgressColor = () => {
    if (result.score <= 2) return "bg-destructive";
    if (result.score <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const requirements = [
    { label: "Minimum 8 characters", met: result.hasMinLength },
    { label: "One uppercase letter", met: result.hasUppercase },
    { label: "One lowercase letter", met: result.hasLowercase },
    { label: "One number", met: result.hasNumber },
    { label: "One special character", met: result.hasSpecialChar },
  ];

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2 animate-fade-in">
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-medium">
          <span>Password Strength</span>
          <span>{Math.round((result.score / 5) * 100)}%</span>
        </div>
        <Progress 
          value={(result.score / 5) * 100} 
          className="h-1.5"
          indicatorClassName={getProgressColor()}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-1.5">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-muted-foreground/50" />
            )}
            <span className={req.met ? "text-foreground font-medium" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
