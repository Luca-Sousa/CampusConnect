import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { signUp } from "@/lib/auth-client";
import { showError } from "@/lib/toast";
import { alunoSchema, colaboradorSchema } from "../../schemas";
import { CargoSelect } from "../CargoSelect";
import { FormInput } from "@/components/form/form-input";

function AlunoForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: alunoSchema },
    onSubmit: async ({ value }) => {
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        role: "aluno",
        cargo: "aluno",
      });
      if (error) {
        showError(error.message ?? "Erro ao criar conta.");
        return;
      }
      onSuccess(value.email);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <FormInput
              field={field}
              label="Nome"
              placeholder="Seu nome completo"
            />
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <FormInput
              field={field}
              label="E-mail institucional"
              type="email"
              placeholder="@aluno.ifce.edu.br"
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
              showPasswordToggle
            />
          )}
        </form.Field>
      </FieldGroup>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

function ColaboradorForm({ onSuccess }: { onSuccess: (email: string) => void }) {
  const form = useForm({
    defaultValues: { name: "", email: "", password: "", cargo: "" },
    validators: { onSubmit: colaboradorSchema },
    onSubmit: async ({ value }) => {
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        role: "colaborador",
        cargo: value.cargo,
      });
      if (error) {
        showError(error.message ?? "Erro ao criar conta.");
        return;
      }
      onSuccess(value.email);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <FormInput
              field={field}
              label="Nome"
              placeholder="Seu nome completo"
            />
          )}
        </form.Field>
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
              showPasswordToggle
            />
          )}
        </form.Field>
        <form.Field name="cargo">
          {(field) => (
            <CargoSelect
              id={field.name}
              value={field.state.value}
              onValueChange={(v) => field.handleChange(v)}
              onBlur={field.handleBlur}
              errors={field.state.meta.errors.map((e) =>
                typeof e === "string" ? e : (e?.message ?? "")
              )}
            />
          )}
        </form.Field>
      </FieldGroup>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

export function SignupForm() {
  const navigate = useNavigate();
  const handleSuccess = (email: string) =>
    navigate(`/verify-email?email=${encodeURIComponent(email)}`);

  return (
    <Card className="w-full max-w-md md:max-w-full lg:max-w-4xl xl:max-w-5xl overflow-hidden p-0">
      <CardContent className="grid p-0 md:grid-cols-[1fr_1.2fr]">
        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-2 text-center mb-6">
            <h1 className="text-2xl font-bold">Criar Conta</h1>
            <p className="text-balance text-muted-foreground">
              Cadastre-se com seu e-mail institucional do IFCE
            </p>
          </div>
          <Tabs defaultValue="aluno" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="aluno" className="flex-1">
                Aluno
              </TabsTrigger>
              <TabsTrigger value="colaborador" className="flex-1">
                Colaborador
              </TabsTrigger>
            </TabsList>
            <TabsContent value="aluno">
              <AlunoForm onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="colaborador">
              <ColaboradorForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-center mt-2">
            <p className="text-sm text-center text-muted-foreground">
              Já possui conta?
            </p>
            <Link to="/signin">
              <Button variant="link">Fazer login</Button>
            </Link>
          </div>
        </div>
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
