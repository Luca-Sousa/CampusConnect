import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { emailOtp, signOut } from "@/lib/auth-client";
import { showError, showSuccess } from "@/lib/toast";
import { useResendCooldown } from "@/hooks/use-resend-cooldown";

interface VerifyEmailFormProps {
  email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { cooldown: resendCooldown, startCooldown } = useResendCooldown(60);

  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length !== 6 || isSubmitting) return;

      setIsSubmitting(true);

      const { error } = await emailOtp.verifyEmail({ email, otp: code });

      if (error) {
        showError(error.message ?? "Código inválido ou expirado.");
        setIsSubmitting(false);
        return;
      }

      showSuccess("E-mail verificado com sucesso!");
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

    const { error } = await emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (error) {
      showError(error.message ?? "Erro ao reenviar código.");
    } else {
      startCooldown();
    }

    setIsResending(false);
  };

  return (
    <Card className="w-full max-w-sm lg:max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verificar e-mail</CardTitle>
        <CardDescription>
          Digite o código de 6 dígitos enviado para{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
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

        <div className="flex justify-center">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-sm"
            onClick={async () => {
              await signOut();
              navigate("/signup");
            }}
          >
            Voltar para o cadastro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
