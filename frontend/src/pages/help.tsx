import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Card, CardContent } from "@/components/ui/card";

import {
  HelpCircle,
  Info,
  Users,
  ChevronDown,
} from "lucide-react";

const HelpPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ajuda</h1>
        <p className="text-muted-foreground mt-2">
          Encontre respostas para as principais dúvidas sobre a plataforma.
        </p>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4">
          <HelpCircle className="h-6 w-6" />
          Perguntas Frequentes
        </h2>

        <div className="space-y-2">
      
          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Como criar uma conta?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Clique em "Criar Conta" na tela de login e utilize seu e-mail
                  institucional do IFCE.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Como editar meu perfil?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Clique no menu do usuário e selecione a opção de perfil para
                  editar suas informações.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Quem pode utilizar a plataforma?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Alunos e colaboradores vinculados ao IFCE.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Como acompanhar eventos?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Acesse a seção "Eventos" através do menu lateral para
                  visualizar os eventos disponíveis.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Como visualizar as notícias do campus?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Acesse a seção "Notícias" para acompanhar comunicados,
                  avisos e novidades da instituição.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Como participar de grupos?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Acesse a seção "Grupos" e participe das comunidades
                  disponíveis conforme seu interesse.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Posso utilizar qualquer e-mail para me cadastrar?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Não. O sistema aceita apenas e-mails institucionais
                  vinculados ao IFCE.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Esqueci minha senha. O que devo fazer?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Utilize a opção "Esqueci minha senha" disponível na tela de
                  login para redefinir seu acesso.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Qual a diferença entre aluno e colaborador?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Alunos utilizam a plataforma para acompanhar informações
                  acadêmicas e participar da comunidade. Colaboradores possuem
                  funcionalidades relacionadas às suas atividades institucionais.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-2 px-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between font-medium cursor-pointer">
                  Como entrar em contato com a equipe do projeto?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-muted-foreground">
                  Consulte a seção "Equipe de Desenvolvimento" desta página para
                  conhecer os responsáveis pelo projeto.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4">
          <Info className="h-6 w-6" />
          Sobre o Projeto
        </h2>

        <Card>
          <CardContent className="p-5">
            <p className="text-muted-foreground">
              O CampusConnect é uma plataforma desenvolvida para conectar alunos
              e colaboradores do IFCE, facilitando a comunicação acadêmica, a
              divulgação de notícias, eventos e grupos de interesse dentro da
              instituição.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4">
          <Users className="h-6 w-6" />
          Equipe de Desenvolvimento
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              Ana Flávia de Sousa Oliveira
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              Geovane Matias de Oliveira
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              Izael de Araujo Silva
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              Lucas de Sousa Silva
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              Maria Auxiliadora de Oliveira Chaves
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;