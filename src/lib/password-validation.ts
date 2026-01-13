export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const checks = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar];
  const score = checks.filter(Boolean).length;
  const isValid = checks.every(Boolean);

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    score,
  };
};
