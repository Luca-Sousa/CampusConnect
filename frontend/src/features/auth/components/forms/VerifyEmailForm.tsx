import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="p-6 md:p-8 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Verificar e-mail</h1>
            <p className="text-balance text-muted-foreground">
              Digite o código de 6 dígitos enviado para{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            disabled={isSubmitting}
            className="mt-6"
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
            className="w-full mt-6"
            onClick={() => handleVerify(otp)}
            disabled={otp.length !== 6 || isSubmitting}
          >
            {isSubmitting ? "Verificando..." : "Verificar e-mail"}
          </Button>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-6">
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

          <div className="flex justify-center mt-2">
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
        </div>
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
