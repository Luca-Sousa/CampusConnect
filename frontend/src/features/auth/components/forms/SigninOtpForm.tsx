import { useState } from "react";
import { Link } from "react-router-dom";
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
import { useResendCooldown } from "@/hooks/use-resend-cooldown";
import { signinOtpSchema } from "@/features/auth/schemas";

type Step = "email" | "otp";

export function SigninOtpForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { cooldown: resendCooldown, startCooldown } = useResendCooldown(0);

  const validateEmail = (value: string): string => {
    const result = signinOtpSchema.shape.email.safeParse(value);
    if (!result.success) return result.error.issues[0]?.message ?? "E-mail inválido.";
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

    await new Promise((resolve) => setTimeout(resolve, 600));

    startCooldown(60);
    setStep("otp");
    setIsSending(false);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      setIsSubmitting(true);
      
      // Salva dados mínimos para o navegador não chiar
      localStorage.setItem("user_logged", "true");
      
      // Força o redirecionamento limpando qualquer trava de rota pendente
      window.location.href = "/feed";
    }
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
              onClick={() => {}}
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
      </CardContent>
    </Card>
  );
}