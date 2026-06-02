import { useState } from "react"
import {
  CalendarIcon,
  ImageIcon,
  NewspaperIcon,
  TextIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useSession } from "@/lib/auth-client"
import { OFFICIAL_CARGOS } from "@/features/auth/constants"
import type { CargoValue } from "@/features/auth/types"
import { EventPostForm } from "./forms/EventPostForm"
import { ImagePostForm } from "./forms/ImagePostForm"
import { NewsPostForm } from "./forms/NewsPostForm"
import { TextPostForm } from "./forms/TextPostForm"

type PostTab = "text" | "image" | "event" | "news"

export function PostComposer() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<PostTab>("text")

  const authorName = session?.user?.name ?? "Você"
  const userCargo =
    (session?.user as { cargo?: string } | undefined)?.cargo ?? ""
  const userRole =
    (session?.user as { role?: string } | undefined)?.role ?? ""
  const canPostNews =
    userRole === "admin" || OFFICIAL_CARGOS.has(userCargo as CargoValue)

  const initials = authorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleSuccess = () => {
    setOpen(false)
    setActiveTab("text")
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
              <Button
                variant="ghost"
                className="flex-1 h-auto justify-start rounded-full bg-muted/50 px-4 py-2.5 font-normal text-sm text-muted-foreground hover:bg-muted"
              >
                O que você está pensando?
              </Button>
            </DialogTrigger>
          </div>

          <div className="flex flex-wrap gap-1 pt-1 border-t">
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-muted-foreground min-w-0"
                onClick={() => setActiveTab("image")}
              >
                <ImageIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">Foto</span>
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-muted-foreground min-w-0"
                onClick={() => setActiveTab("event")}
              >
                <CalendarIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">Evento</span>
              </Button>
            </DialogTrigger>
            {canPostNews && (
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-2 text-orange-600 min-w-0"
                  onClick={() => setActiveTab("news")}
                >
                  <NewspaperIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">Notícia</span>
                </Button>
              </DialogTrigger>
            )}
          </div>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Criar publicação</DialogTitle>
          <DialogDescription>
            Escolha o tipo de publicação e preencha os campos.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as PostTab)}
        >
          <TabsList
            className={`grid w-full ${
              canPostNews ? "grid-cols-4" : "grid-cols-3"
            }`}
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

          <TabsContent value="text" className="pt-4">
            <TextPostForm onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="image" className="pt-4">
            <ImagePostForm onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="event" className="pt-4">
            <EventPostForm onSuccess={handleSuccess} />
          </TabsContent>

          {canPostNews && (
            <TabsContent value="news" className="pt-4">
              <NewsPostForm onSuccess={handleSuccess} />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
