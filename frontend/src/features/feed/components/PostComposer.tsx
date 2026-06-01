import { useRef, useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  ImageIcon,
  MapPinIcon,
  NewspaperIcon,
  TextIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { showError, showSuccess } from "@/lib/toast";
import { useCreatePost } from "../hooks/use-create-post";

const OFFICIAL_CARGOS = new Set([
  "direcao",
  "administracao",
  "coordenador",
  "centro_academico",
]);

export function PostComposer() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const { mutateAsync, isPending } = useCreatePost();

  const authorName = session?.user?.name ?? "Você";
  const userCargo = (session?.user as { cargo?: string })?.cargo ?? "";
  const userRole = (session?.user as { role?: string })?.role ?? "";
  const canPostNews = userRole === "admin" || OFFICIAL_CARGOS.has(userCargo);

  const initials = authorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // ── Text state ─────────────────────────────────────────────────────────────
  const [textContent, setTextContent] = useState("");

  // ── Image state ─────────────────────────────────────────────────────────────
  const [imageContent, setImageContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Event state ─────────────────────────────────────────────────────────────
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventContent, setEventContent] = useState("");

  // ── News state ──────────────────────────────────────────────────────────────
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");

  function resetAll() {
    setTextContent("");
    setImageContent("");
    setImageUrl("");
    setImagePreview("");
    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventContent("");
    setNewsTitle("");
    setNewsContent("");
    setActiveTab("text");
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    if (file.size > MAX_SIZE) {
      showError("A imagem deve ter no máximo 2 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImageUrl(dataUrl);
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    let body: Record<string, unknown>;

    switch (activeTab) {
      case "text": {
        if (!textContent.trim()) {
          showError("Escreva algo antes de publicar.");
          return;
        }
        body = { type: "text", content: textContent.trim() };
        break;
      }
      case "image": {
        if (!imageUrl) {
          showError("Selecione uma imagem.");
          return;
        }
        body = {
          type: "image",
          imageUrl,
          content: imageContent.trim() || undefined,
        };
        break;
      }
      case "event": {
        if (
          !eventTitle.trim() ||
          !eventDate ||
          !eventTime ||
          !eventLocation.trim()
        ) {
          showError("Preencha todos os campos do evento.");
          return;
        }
        body = {
          type: "event",
          eventTitle: eventTitle.trim(),
          eventDate,
          eventTime,
          eventLocation: eventLocation.trim(),
          content: eventContent.trim() || undefined,
        };
        break;
      }
      case "news": {
        if (!newsTitle.trim() || !newsContent.trim()) {
          showError("Preencha o título e o conteúdo da notícia.");
          return;
        }
        body = {
          type: "news",
          newsTitle: newsTitle.trim(),
          content: newsContent.trim(),
        };
        break;
      }
      default:
        return;
    }

    try {
      await mutateAsync(body);
      showSuccess("Publicação criada com sucesso!");
      setOpen(false);
      resetAll();
    } catch {
      // erro já tratado em useCreatePost → onError
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-orange-100">
              <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <DialogTrigger asChild>
              <div className="flex-1 bg-muted/50 rounded-full px-4 py-2.5 cursor-pointer text-sm text-muted-foreground hover:bg-muted transition-colors select-none">
                O que você está pensando?
              </div>
            </DialogTrigger>
          </div>

          <div className="flex gap-1 pt-1 border-t">
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-muted-foreground"
                onClick={() => setActiveTab("image")}
              >
                <ImageIcon className="h-4 w-4" />
                Foto
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-muted-foreground"
                onClick={() => setActiveTab("event")}
              >
                <CalendarIcon className="h-4 w-4" />
                Evento
              </Button>
            </DialogTrigger>
            {canPostNews && (
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-2 text-orange-600"
                  onClick={() => setActiveTab("news")}
                >
                  <NewspaperIcon className="h-4 w-4" />
                  Notícia
                </Button>
              </DialogTrigger>
            )}
          </div>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar publicação</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className={`grid w-full ${canPostNews ? "grid-cols-4" : "grid-cols-3"}`}
          >
            <TabsTrigger value="text" className="gap-1.5">
              <TextIcon className="h-3.5 w-3.5" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              Foto
            </TabsTrigger>
            <TabsTrigger value="event" className="gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              Evento
            </TabsTrigger>
            {canPostNews && (
              <TabsTrigger value="news" className="gap-1.5">
                <NewspaperIcon className="h-3.5 w-3.5" />
                Notícia
              </TabsTrigger>
            )}
          </TabsList>

          {/* ── Texto ─────────────────────────────────────────────────────── */}
          <TabsContent value="text" className="space-y-3 pt-2">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="No que você está pensando?"
              rows={5}
              maxLength={5000}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground text-right">
              {textContent.length}/5000
            </p>
          </TabsContent>

          {/* ── Foto ──────────────────────────────────────────────────────── */}
          <TabsContent value="image" className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label>Imagem</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageFile}
              />
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Prévia"
                    className="w-full max-h-60 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setImagePreview("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs hover:bg-black/80"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/40 transition-colors"
                >
                  <ImageIcon className="h-8 w-8 opacity-40" />
                  Clique para selecionar uma imagem (máx. 2 MB)
                </button>
              )}
            </div>
            <textarea
              value={imageContent}
              onChange={(e) => setImageContent(e.target.value)}
              placeholder="Legenda (opcional)"
              rows={3}
              maxLength={2000}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </TabsContent>

          {/* ── Evento ────────────────────────────────────────────────────── */}
          <TabsContent value="event" className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="event-title">Título do evento</Label>
              <Input
                id="event-title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Ex: Semana de TI 2025"
                maxLength={200}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="event-date"
                  className="flex items-center gap-1.5"
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Data
                </Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="event-time"
                  className="flex items-center gap-1.5"
                >
                  <ClockIcon className="h-3.5 w-3.5" />
                  Horário
                </Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="event-location"
                className="flex items-center gap-1.5"
              >
                <MapPinIcon className="h-3.5 w-3.5" />
                Local
              </Label>
              <Input
                id="event-location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Ex: Auditório Principal - IFCE"
                maxLength={300}
              />
            </div>
            <textarea
              value={eventContent}
              onChange={(e) => setEventContent(e.target.value)}
              placeholder="Descrição do evento (opcional)"
              rows={3}
              maxLength={2000}
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </TabsContent>

          {/* ── Notícia ───────────────────────────────────────────────────── */}
          {canPostNews && (
            <TabsContent value="news" className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="news-title">Título da notícia</Label>
                <Input
                  id="news-title"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Ex: Inscrições abertas para o ENEM 2025"
                  maxLength={200}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="news-content">Conteúdo</Label>
                <textarea
                  id="news-content"
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Descreva a notícia..."
                  rows={5}
                  maxLength={5000}
                  className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {newsContent.length}/5000
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <Button
          className="w-full mt-2"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Publicando..." : "Publicar"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
