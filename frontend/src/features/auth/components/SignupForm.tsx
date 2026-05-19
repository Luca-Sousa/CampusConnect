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
import { signUp } from "@/lib/auth-client";
import { FormInput } from "./FormInput";

const signupSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.email("E-mail inválido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export function SignupForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: signupSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await signUp.email(value);
      if (error) {
        setServerError(error.message ?? "Erro ao criar conta.");
        return;
      }
      navigate("/feed");
    },
  });

  return (
    <Card className="w-full max-w-sm shadow-2xl border">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Cadastre-se com seu e-mail institucional
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
            <form.Field name="name">
              {(field) => (
                <FormInput field={field} label="Nome" placeholder="Seu nome" />
              )}
            </form.Field>
            <form.Field name="email">
              {(field) => (
                <FormInput
                  field={field}
                  label="E-mail institucional"
                  type="email"
                  placeholder="seunome@uni.br"
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
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </Button>
            )}
          </form.Subscribe>

          <div className="flex items-center justify-center">
            <p className="text-sm text-center text-muted-foreground">
              Já possui conta?
            </p>
            <Link to="/signin">
              <Button variant="link">Fazer login</Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
