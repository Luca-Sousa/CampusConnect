import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { emailOtp } from "@/lib/auth-client";
import { showError } from "@/lib/toast";
import { forgotPasswordSchema } from "../schemas";
import { FormInput } from "./FormInput";

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
      navigate(`/reset-password?email=${encodeURIComponent(value.email)}`);
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Esqueceu a senha?</CardTitle>
        <CardDescription>
          Informe seu e-mail institucional e enviaremos um código para redefinir
          sua senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
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
          </FieldGroup>

          <form.Subscribe selector={(s) => s.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                className="w-full mt-2"
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
        </form>
      </CardContent>
    </Card>
  );
}
