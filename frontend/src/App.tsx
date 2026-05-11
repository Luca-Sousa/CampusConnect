import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const App = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">CampusConnect</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Plataforma de conexão universitária
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Eventos</CardTitle>
            <CardDescription>
              Fique por dentro dos eventos do campus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Ver eventos</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grupos</CardTitle>
            <CardDescription>Conecte-se com outros estudantes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Explorar grupos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notícias</CardTitle>
            <CardDescription>
              Acompanhe as novidades da universidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="secondary">
              Ler notícias
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
