import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { emailOtp } from "@/lib/auth-client";
import { showError, showInfo } from "@/lib/toast";
import { forgotPasswordSchema } from "../../schemas";
import { FormInput } from "@/components/form/form-input";

export function ForgotPasswordForm() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      const { error } = await emailOtp.requestPasswordReset({ email: value.email });
      if (error) {
        showError(error.message ?? "Erro ao enviar código.");
        return;
      }
      showInfo("Código enviado! Verifique sua caixa de entrada.");
      navigate(`/reset-password?email=${encodeURIComponent(value.email)}`);
    },
  });

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="p-6 md:p-8"
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Esqueceu a senha?</h1>
              <p className="text-balance text-muted-foreground">
                Informe seu e-mail institucional e enviaremos um código para
                redefinir sua senha.
              </p>
            </div>

            <form.Field name="email">
              {(field) => (
                <FormInput
                  field={field}
                  label="E-mail institucional"
                  type="email"
                  placeholder="nome@aluno.ifce.edu.br"
                />
              )}
            </form.Field>

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar código"}
                </Button>
              )}
            </form.Subscribe>

            <div className="flex justify-center">
              <Button variant="link" size="sm" className="h-auto p-0 text-sm" asChild>
                <Link to="/signin">Voltar para o login</Link>
              </Button>
            </div>
          </FieldGroup>
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
