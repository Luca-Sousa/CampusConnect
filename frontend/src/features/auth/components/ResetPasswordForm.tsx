import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailOtp } from "@/lib/auth-client";

interface ResetPasswordFormProps {
  email: string;
}

export function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validate = useCallback(() => {
    const errors: typeof fieldErrors = {};
    if (otp.length !== 6) errors.otp = "O código deve ter 6 dígitos.";
    if (password.length < 8)
      errors.password = "A senha deve ter pelo menos 8 caracteres.";
    if (password !== confirmPassword)
      errors.confirmPassword = "As senhas não coincidem.";
    return errors;
  }, [otp, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setServerError(null);

    const { error } = await emailOtp.resetPassword({ email, otp, password });

    if (error) {
      setServerError(error.message ?? "Erro ao redefinir senha.");
      setIsSubmitting(false);
      return;
    }

    navigate("/signin");
  };

  const handleResend = async () => {
    setIsResending(true);
    setServerError(null);

    const { error } = await emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });

    if (error) {
      setServerError(error.message ?? "Erro ao reenviar código.");
    } else {
      setResendCooldown(60);
    }

    setIsResending(false);
  };

  return (
    <Card className="w-full max-w-sm lg:max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Nova senha</CardTitle>
        <CardDescription>
          Insira o código enviado para{" "}
          <span className="font-medium text-foreground">{email}</span> e escolha
          sua nova senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {serverError && (
            <p className="text-sm text-destructive text-center" role="alert">
              {serverError}
            </p>
          )}

          {/* OTP */}
          <div className="flex flex-col items-center gap-2">
            <Label>Código de verificação</Label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isSubmitting}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {fieldErrors.otp && (
              <p className="text-sm text-destructive">{fieldErrors.otp}</p>
            )}
          </div>

          {/* Nova senha */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              disabled={isSubmitting}
            />
            {fieldErrors.password && (
              <p className="text-sm text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirmar senha */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={!!fieldErrors.confirmPassword}
              disabled={isSubmitting}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-destructive">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Redefinir senha"}
          </Button>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-center">
            <span>Não recebeu?</span>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0 text-sm"
              disabled={resendCooldown > 0 || isResending}
              onClick={handleResend}
            >
              {resendCooldown > 0
                ? `Reenviar em ${resendCooldown}s`
                : "Reenviar código"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
