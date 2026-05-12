import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const newsItems = [
  {
    id: 1,
    title: "Semana Acadêmica de TI",
    description: "Palestras e workshops sobre tecnologia nos dias 20 a 24 de maio.",
    date: "12 mai 2026",
  },
  {
    id: 2,
    title: "Inscrições abertas para IC",
    description: "Iniciação Científica: submissões até 30 de maio pelo portal do aluno.",
    date: "10 mai 2026",
  },
  {
    id: 3,
    title: "Novo RU aberto",
    description: "O Restaurante Universitário do Bloco C começa a funcionar na próxima semana.",
    date: "8 mai 2026",
  },
];

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Notícias</h1>
        <div className="flex flex-col gap-4">
          {newsItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</span>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
