import { useState } from "react";
import { PencilLineIcon } from "lucide-react";
import {
  AppDialog,
  AppDialogAction,
  AppDialogBody,
  AppDialogCancel,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  DialogTrigger,
} from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { env } from "@/env";

export default function CreatePostDialog() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [moderated, setModerated] = useState(false);

  const handlePublish = async () => {
    setError(null);
    if (!content.trim()) {
      setError("Conteúdo obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${env.API_URL}/api/posts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", content: content.trim() }),
      });

      if (res.status === 201) {
        const created = await res.json();
        setTags(created.tags ?? null);
        setModerated(!!created.moderated);
        setContent("");
      } else if (res.status === 401) {
        setError("Não autorizado. Faça login antes de publicar.");
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Erro ao publicar.");
      }
    } catch (err) {
      setError("Falha de rede.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppDialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          Criar publicação
        </Button>
      </DialogTrigger>

      <AppDialogContent maxWidth="md">
        <AppDialogHeader
          icon={PencilLineIcon}
          title="Nova publicação"
          description="Escreva o que você está pensando."
        />

        <AppDialogBody>
          <textarea
            className="w-full border rounded-md p-3 min-h-30"
            placeholder="Digite sua publicação..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          {error ? (
            <div className="text-red-600 mt-2">{error}</div>
          ) : null}

          {moderated ? (
            <div className="mt-2 text-yellow-700">Sua publicação foi marcada para moderação.</div>
          ) : null}

          {tags && tags.length > 0 ? (
            <div className="mt-3">
              <div className="text-sm text-gray-600">Tags sugeridas:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {tags.map((t) => (
                  <span key={t} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </AppDialogBody>

        <AppDialogFooter>
          <AppDialogCancel>Cancelar</AppDialogCancel>
          <AppDialogAction onClick={handlePublish} disabled={loading}>
            {loading ? "Publicando..." : "Publicar"}
          </AppDialogAction>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
