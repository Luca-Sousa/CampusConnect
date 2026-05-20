import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { emailOtp } from "@/lib/auth-client";

interface VerifyEmailFormProps {
  email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
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

  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length !== 6 || isSubmitting) return;

      setIsSubmitting(true);
      setServerError(null);

      const { error } = await emailOtp.verifyEmail({ email, otp: code });

      if (error) {
        setServerError(error.message ?? "Código inválido ou expirado.");
        setIsSubmitting(false);
        return;
      }

      // Reload completo para garantir que a sessão reflita emailVerified: true
      window.location.replace("/feed");
    },
    [email, isSubmitting],
  );

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setServerError(null);

    const { error } = await emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (error) {
      setServerError(error.message ?? "Erro ao reenviar código.");
    } else {
      setResendCooldown(60);
    }

    setIsResending(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verificar e-mail</CardTitle>
        <CardDescription>
          Digite o código de 6 dígitos enviado para{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {serverError && (
          <p className="text-sm text-destructive text-center" role="alert">
            {serverError}
          </p>
        )}

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={handleOtpChange}
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

        <Button
          type="button"
          className="w-full"
          onClick={() => handleVerify(otp)}
          disabled={otp.length !== 6 || isSubmitting}
        >
          {isSubmitting ? "Verificando..." : "Verificar e-mail"}
        </Button>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Não recebeu?</span>
          <Button
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
      </CardContent>
    </Card>
  );
}
