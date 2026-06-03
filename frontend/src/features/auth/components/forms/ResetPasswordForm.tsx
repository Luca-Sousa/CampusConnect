import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailOtp } from "@/lib/auth-client";
import { showError, showSuccess } from "@/lib/toast";
import { useResendCooldown } from "@/hooks/use-resend-cooldown";

interface ResetPasswordFormProps {
  email: string;
}

export function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { cooldown: resendCooldown, startCooldown } = useResendCooldown(60);

  const validate = useCallback(() => {
    const errors: typeof fieldErrors = {};
    if (otp.length !== 6) errors.otp = "O código deve ter 6 dígitos.";
    if (password.length < 8)
      errors.password = "A senha deve ter pelo menos 8 caracteres.";
    if (password !== confirmPassword)
      errors.confirmPassword = "As senhas não coincidem.";
    return errors;
  }, [otp, password, confirmPassword]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    const { error } = await emailOtp.resetPassword({ email, otp, password });

    if (error) {
      showError(error.message ?? "Erro ao redefinir senha.");
      setIsSubmitting(false);
      return;
    }

    showSuccess("Senha redefinida com sucesso!", 10000);
    navigate("/signin");
  };

  const handleResend = async () => {
    setIsResending(true);

    const { error } = await emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });

    if (error) {
      showError(error.message ?? "Erro ao reenviar código.");
    } else {
      startCooldown();
    }

    setIsResending(false);
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Nova senha</h1>
            <p className="text-balance text-muted-foreground">
              Insira o código enviado para{" "}
              <span className="font-medium text-foreground">{email}</span> e
              escolha sua nova senha.
            </p>
          </div>

          {/* OTP */}
          <div className="flex flex-col items-center gap-2 mt-6">
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
          <div className="flex flex-col gap-1.5 mt-6">
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
          <div className="flex flex-col gap-1.5 mt-4">
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

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Redefinir senha"}
          </Button>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-center mt-4">
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
        <div className="relative hidden bg-muted md:block">
          <img
            src="/banner-logo.svg"
            alt="CampusConnect"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
}
