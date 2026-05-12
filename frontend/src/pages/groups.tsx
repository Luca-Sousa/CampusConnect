import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const groups = [
  {
    id: 1,
    name: "Engenharia de Software",
    description: "Discussões sobre padrões de projeto, arquitetura e boas práticas.",
    members: 42,
  },
  {
    id: 2,
    name: "Inteligência Artificial",
    description: "Artigos, experimentos e projetos de IA e Machine Learning.",
    members: 78,
  },
  {
    id: 3,
    name: "Desenvolvimento Web",
    description: "Front-end, back-end, DevOps e tudo sobre a web moderna.",
    members: 95,
  },
  {
    id: 4,
    name: "Pesquisa & Inovação",
    description: "Grupo voltado a iniciação científica e trabalhos acadêmicos.",
    members: 31,
  },
];

const GroupsPage = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Grupos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{group.members} membros</span>
                <Button size="sm" variant="outline">
                  Entrar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
