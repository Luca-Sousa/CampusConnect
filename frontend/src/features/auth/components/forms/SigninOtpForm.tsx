import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { emailOtp, signIn } from "@/lib/auth-client";
import { env } from "@/env";
import { showError, showSuccess } from "@/lib/toast";
import { useResendCooldown } from "@/hooks/use-resend-cooldown";

type Step = "email" | "otp";

export function SigninOtpForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { cooldown: resendCooldown, startCooldown } = useResendCooldown(0);

  const validateEmail = (value: string): string => {
    if (!value) return "Informe o e-mail institucional.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido.";
    return "";
  };

  const handleSendCode = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError("");
    setIsSending(true);

    const { error: apiError } = await emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (apiError) {
      showError(apiError.message ?? "Erro ao enviar código.");
      setIsSending(false);
      return;
    }

    startCooldown(60);
    setStep("otp");
    setIsSending(false);
  };

  const handleSignIn = useCallback(
    async (code: string) => {
      if (code.length !== 6 || isSubmitting) return;

      setIsSubmitting(true);

      const { error } = await signIn.emailOtp({ email, otp: code });

      if (error) {
        showError(error.message ?? "Código inválido ou expirado.");
        setIsSubmitting(false);
        return;
      }

      showSuccess("Login realizado com sucesso!");

      // Notificação de novo acesso — fire-and-forget
      fetch(`${env.API_URL}/api/notifications/login`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});

      navigate("/feed");
    },
    [email, isSubmitting, navigate],
  );

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleSignIn(value);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    const { error } = await emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      showError(error.message ?? "Erro ao reenviar código.");
    } else {
      setOtp("");
      startCooldown(60);
    }

    setIsResending(false);
  };

  if (step === "email") {
    return (
      <Card className="w-full max-w-sm lg:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entrar com código</CardTitle>
          <CardDescription>
            Informe seu e-mail institucional para receber um código de acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail institucional</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@aluno.ifce.edu.br"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                aria-invalid={!!emailError}
                disabled={isSending}
                autoFocus
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isSending}>
              {isSending ? "Enviando..." : "Enviar código"}
            </Button>

            <div className="flex items-center justify-center">
              <Link to="/signin">
                <Button variant="link" className="text-sm">
                  Voltar para o login
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verificar código</CardTitle>
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
          autoFocus
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

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Não recebeu o código?</span>
          {resendCooldown > 0 ? (
            <span className="text-foreground font-medium">
              Reenviar em {resendCooldown}s
            </span>
          ) : (
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? "Reenviando..." : "Reenviar código"}
            </Button>
          )}
        </div>

        <Button
          variant="link"
          className="text-sm text-muted-foreground"
          onClick={() => {
            setStep("email");
            setOtp("");
          }}
        >
          Alterar e-mail
        </Button>

        <div className="flex items-center justify-center">
          <Link to="/signin">
            <Button variant="link" className="text-sm">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
