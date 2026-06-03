import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth-client";
import { env } from "@/env";
import { showError } from "@/lib/toast";
import { signinSchema } from "../../schemas";
import { FormInput } from "@/components/form/form-input";

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
      fetch(`${env.API_URL}/api/notifications/login`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
      navigate("/feed");
    },
  });

  return (
    <Card className="w-full max-w-md md:max-w-full lg:max-w-4xl xl:max-w-5xl overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="p-6 md:p-8"
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Entre com sua conta institucional
              </p>
            </div>

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

            <Button type="submit" className="w-full">
              Entrar
            </Button>

            <div className="relative flex items-center gap-3">
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
          </FieldGroup>
        </form>
        <div className="relative hidden bg-muted md:block">
          <img
            src="/banner-logo.svg"
            alt="CampusConnect"
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />
        </div>
      </CardContent>
    </Card>
  );
}
