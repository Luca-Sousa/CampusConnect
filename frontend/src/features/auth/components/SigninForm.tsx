import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
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
import { signIn } from "@/lib/auth-client";
import { FormInput } from "./FormInput";

const signinSchema = z.object({
  email: z
    .email("E-mail inválido.")
    .refine(
      (e) =>
        e.toLowerCase().endsWith("@aluno.ifce.edu.br") ||
        e.toLowerCase().endsWith("@ifce.edu.br"),
      { message: "Use seu e-mail institucional do IFCE." },
    ),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export function SigninForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: signinSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await signIn.email(value);
      if (error) {
        setServerError(error.message ?? "Erro ao fazer login.");
        return;
      }
      navigate("/feed");
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Entre com sua conta institucional
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
          {serverError && (
            <p className="text-sm text-destructive text-center">
              {serverError}
            </p>
          )}
          <FieldGroup>
            <form.Field name="email">
              {(field) => (
                <FormInput
                  field={field}
                  label="E-mail institucional"
                  type="email"
                  placeholder="seuemail@ifce.edu.br"
                />
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <FormInput
                  field={field}
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                />
              )}
            </form.Field>
          </FieldGroup>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            )}
          </form.Subscribe>

          <div className="flex items-center justify-center">
            <p className="text-sm text-center text-muted-foreground">
              Não possui conta?
            </p>
            <Link to="/signup">
              <Button variant="link">Criar conta</Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
