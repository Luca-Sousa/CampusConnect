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
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUp } from "@/lib/auth-client";
import { FormInput } from "./FormInput";

const CARGO_OPTIONS = [
  { value: "professor", label: "Professor(a)" },
  { value: "coordenador", label: "Coordenador(a) de Curso" },
  { value: "direcao", label: "Direção" },
  { value: "administracao", label: "Administração" },
  { value: "secretaria", label: "Secretaria Acadêmica" },
  { value: "centro_academico", label: "Centro Acadêmico (C.A.)" },
  { value: "biblioteca", label: "Biblioteca" },
  { value: "ti", label: "TI" },
] as const;

const alunoSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z
    .email("E-mail inválido.")
    .refine((e) => e.toLowerCase().endsWith("@aluno.ifce.edu.br"), {
      message: "Use um e-mail @aluno.ifce.edu.br.",
    }),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

const colaboradorSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z
    .email("E-mail inválido.")
    .refine(
      (e) =>
        e.toLowerCase().endsWith("@ifce.edu.br") &&
        !e.toLowerCase().endsWith("@aluno.ifce.edu.br"),
      { message: "Use um e-mail @ifce.edu.br" },
    ),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
  cargo: z.string().min(1, "Selecione seu cargo."),
});

function AlunoForm({ onSuccess }: { onSuccess: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: alunoSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        role: "aluno",
        cargo: "aluno",
      });
      if (error) {
        setServerError(error.message ?? "Erro ao criar conta.");
        return;
      }
      onSuccess();
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
      {serverError && (
        <p className="text-sm text-destructive text-center">{serverError}</p>
      )}
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
              placeholder="seuemail@aluno.ifce.edu.br"
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
          <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

function ColaboradorForm({ onSuccess }: { onSuccess: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", cargo: "" },
    validators: { onSubmit: colaboradorSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        role: "colaborador",
        cargo: value.cargo,
      });
      if (error) {
        setServerError(error.message ?? "Erro ao criar conta.");
        return;
      }
      onSuccess();
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
      {serverError && (
        <p className="text-sm text-destructive text-center">{serverError}</p>
      )}
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
        <form.Field name="cargo">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>Cargo</Label>
              <Select
                value={field.state.value}
                onValueChange={(v) => field.handleChange(v)}
              >
                <SelectTrigger
                  id={field.name}
                  onBlur={field.handleBlur}
                  className="w-full"
                >
                  <SelectValue placeholder="Selecione seu cargo" />
                </SelectTrigger>
                <SelectContent>
                  {CARGO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-xs">
                  {field.state.meta.errors
                    .map((e) => (typeof e === "string" ? e : e?.message))
                    .join(", ")}
                </p>
              )}
            </div>
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
  const handleSuccess = () => navigate("/feed");

  return (
    <Card className="w-full max-w-sm lg:max-w-md shadow-2xl border">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Cadastre-se com seu e-mail institucional do IFCE
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
