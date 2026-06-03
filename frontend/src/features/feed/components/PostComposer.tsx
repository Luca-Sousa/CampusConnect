import { useState } from "react"
import {
  CalendarIcon,
  ImageIcon,
  NewspaperIcon,
  PencilLineIcon,
  TextIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  DialogTrigger,
} from "@/components/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useSession } from "@/lib/auth-client"
import { OFFICIAL_CARGOS } from "@/features/auth/constants"
import type { CargoValue } from "@/features/auth/types"
import type {
  EventPost,
  ImagePost,
  NewsPost,
  Post,
  TextPost,
} from "../types"
import {
  EventPostForm,
  EVENT_POST_FORM_ID,
} from "./forms/EventPostForm"
import {
  ImagePostForm,
  IMAGE_POST_FORM_ID,
} from "./forms/ImagePostForm"
import {
  NewsPostForm,
  NEWS_POST_FORM_ID,
} from "./forms/NewsPostForm"
import {
  TextPostForm,
  TEXT_POST_FORM_ID,
} from "./forms/TextPostForm"

type PostTab = "text" | "image" | "event" | "news"

const FORM_ID_BY_TAB: Record<PostTab, string> = {
  text: TEXT_POST_FORM_ID,
  image: IMAGE_POST_FORM_ID,
  event: EVENT_POST_FORM_ID,
  news: NEWS_POST_FORM_ID,
}

const SUBMIT_LABEL_BY_TAB: Record<PostTab, string> = {
  text: "Publicar",
  image: "Publicar",
  event: "Publicar evento",
  news: "Publicar comunicado",
}

const SUBMIT_LABEL_EDIT_BY_TAB: Record<PostTab, string> = {
  text: "Salvar alterações",
  image: "Salvar alterações",
  event: "Salvar alterações",
  news: "Salvar alterações",
}

interface PostComposerProps {
  /**
   * Quando definido, o composer abre em modo **edit** pré-preenchendo o
   * formulário com os dados do post. Quando volta a `null` (após fechar),
   * o composer volta ao modo de criação.
   */
  editingPost?: Post | null
  /** Callback quando o usuário fecha o composer em modo edit. */
  onEditClose?: () => void
}

// ---------------------------------------------------------------------------
// Helpers de extração de defaults por tipo
// ---------------------------------------------------------------------------

function textDefaults(post: TextPost) {
  return { content: post.content ?? "" }
}

function imageDefaults(post: ImagePost) {
  return { imageUrl: post.imageUrl, content: post.content ?? "" }
}

function eventDefaults(post: EventPost) {
  return {
    eventTitle: post.eventTitle,
    eventDate: post.eventDate,
    eventTime: post.eventTime,
    eventEndTime: post.eventEndTime ?? "",
    eventLocation: post.eventLocation,
    content: post.content ?? "",
    imageUrl: post.imageUrl ?? "",
  }
}

function newsDefaults(post: NewsPost) {
  return {
    newsTitle: post.newsTitle,
    content: post.content ?? "",
    imageUrl: post.imageUrl ?? "",
  }
}

export function PostComposer({
  editingPost = null,
  onEditClose,
}: PostComposerProps = {}) {
  const { data: session } = useSession()

  // Estado controlado pelo usuário (apenas no fluxo de criação).
  // No modo edit, `open` e `activeTab` são DERIVADOS de `editingPost`
  // para evitar `setState` em `useEffect` (cascading renders) — vide
  // https://react.dev/learn/you-might-not-need-an-effect
  const [createOpen, setCreateOpen] = useState(false)
  const [createTab, setCreateTab] = useState<PostTab>("text")

  const isEdit = editingPost != null
  const open = isEdit || createOpen
  const activeTab: PostTab = isEdit ? editingPost.type : createTab

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

  const handleOpenChange = (next: boolean) => {
    setCreateOpen(next)
    if (!next && isEdit) {
      onEditClose?.()
    }
  }

  const handleSuccess = () => {
    setCreateOpen(false)
    if (isEdit) {
      onEditClose?.()
    } else {
      setCreateTab("text")
    }
  }

  // ---------------------------------------------------------------------------
  // Form rendering
  // ---------------------------------------------------------------------------

  const renderEditForm = () => {
    if (!editingPost) return null
    switch (editingPost.type) {
      case "text":
        return (
          <TextPostForm
            mode="edit"
            postId={editingPost.id}
            defaultValues={textDefaults(editingPost)}
            onSuccess={handleSuccess}
          />
        )
      case "image":
        return (
          <ImagePostForm
            mode="edit"
            postId={editingPost.id}
            defaultValues={imageDefaults(editingPost)}
            onSuccess={handleSuccess}
          />
        )
      case "event":
        return (
          <EventPostForm
            mode="edit"
            postId={editingPost.id}
            defaultValues={eventDefaults(editingPost)}
            onSuccess={handleSuccess}
          />
        )
      case "news":
        return (
          <NewsPostForm
            mode="edit"
            postId={editingPost.id}
            defaultValues={newsDefaults(editingPost)}
            onSuccess={handleSuccess}
          />
        )
    }
  }

  const renderCreateForms = () => (
    <>
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
    </>
  )

  const submitLabel = isEdit
    ? SUBMIT_LABEL_EDIT_BY_TAB[activeTab]
    : SUBMIT_LABEL_BY_TAB[activeTab]

  const headerTitle = isEdit ? "Editar publicação" : "Criar publicação"
  const headerDescription = isEdit
    ? "Atualize as informações da sua publicação."
    : "Escolha o tipo de publicação e preencha os campos."

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <Card className="shadow-sm">
        <CardContent className="px-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-orange-100">
              <AvatarImage src={(session?.user as { image?: string } | undefined)?.image ?? undefined} />
              <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 h-auto justify-start rounded-full bg-muted/50 px-4 py-2.5 font-normal text-sm text-muted-foreground hover:bg-muted"
                onClick={() => {
                  if (isEdit) onEditClose?.()
                  setCreateTab("text")
                }}
              >
                O que você está pensando?
              </Button>
            </DialogTrigger>
          </div>

          {!isEdit && (
            <div className="flex flex-wrap gap-1 pt-1 border-t">
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-2 text-muted-foreground min-w-0"
                  onClick={() => setCreateTab("image")}
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
                  onClick={() => setCreateTab("event")}
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
                    onClick={() => setCreateTab("news")}
                  >
                    <NewspaperIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate">Notícia</span>
                  </Button>
                </DialogTrigger>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AppDialogContent maxWidth="2xl">
        <AppDialogHeader
          icon={PencilLineIcon}
          title={headerTitle}
          description={headerDescription}
        />

        <AppDialogBody>
          {isEdit ? (
            // Em modo edit a tab é fixa no tipo do post; sem TabsList visível.
            renderEditForm()
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={(v) => setCreateTab(v as PostTab)}
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
              {renderCreateForms()}
            </Tabs>
          )}
        </AppDialogBody>

        <AppDialogFooter>
          <Button
            type="submit"
            form={FORM_ID_BY_TAB[activeTab]}
            className="w-full! sm:w-auto"
          >
            {submitLabel}
          </Button>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  )
}
