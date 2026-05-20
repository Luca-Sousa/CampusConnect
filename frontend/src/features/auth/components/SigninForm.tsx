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
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth-client";
import { env } from "@/env";
import { showError } from "@/lib/toast";
import { signinSchema } from "../schemas";
import { FormInput } from "./FormInput";

export function SigninForm() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: signinSchema },
    onSubmit: async ({ value }) => {
      const { error } = await signIn.email(value);
      if (error) {
        showError(error.message ?? "Erro ao fazer login.");
        return;
      }
      // Notificação de novo acesso — fire-and-forget
      fetch(`${env.API_URL}/api/notifications/login`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
      navigate("/feed");
    },
  });

  return (
    <Card className="w-full max-w-sm lg:max-w-md">
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
          <FieldGroup>
            <form.Field name="email">
              {(field) => (
                <FormInput
                  field={field}
                  label="E-mail institucional"
                  type="email"
                  placeholder="@ifce.edu.br"
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
                  subLabel={
                    <Link
                      to="/forgot-password"
                      className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  }
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

          <div className="relative flex items-center gap-3 my-1">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">ou</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link to="/signin-otp">Entrar com código de acesso</Link>
          </Button>

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
