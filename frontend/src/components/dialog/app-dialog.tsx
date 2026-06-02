import * as React from "react"
import type { ReactNode } from "react"
import { XIcon, type LucideIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button, type buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose as DialogPrimitiveClose,
  DialogContent,
  DialogDescription as DialogPrimitiveDescription,
  DialogFooter,
  DialogTitle as DialogPrimitiveTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type VariantProps = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"]
type SizeProps = NonNullable<Parameters<typeof buttonVariants>[0]>["size"]

// ---------------------------------------------------------------------------
// AppDialog (root + re-exports do shadcn primitivo)
// ---------------------------------------------------------------------------

type AppDialogProps = React.ComponentProps<typeof DialogPrimitive.Root>

function AppDialog(props: AppDialogProps) {
  return <Dialog {...props} />
}

// ---------------------------------------------------------------------------
// AppDialogContent — wrapper do DialogContent com layout grid de 3 linhas
// (auto / 1fr / auto) e max-h-[90vh]. Header/Body/Footer controlam o próprio
// padding. showCloseButton é desativado porque o X é renderizado pelo Header
// (caso contrário, o bg-popover do header com z-10 cobre o X da shadcn).
// ---------------------------------------------------------------------------

type AppDialogMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"

const MAX_WIDTH_CLASS: Record<AppDialogMaxWidth, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  full: "sm:max-w-[calc(100%-2rem)]",
}

interface AppDialogContentProps {
  children: ReactNode
  maxWidth?: AppDialogMaxWidth
  className?: string
}

function AppDialogContent({
  children,
  maxWidth = "md",
  className,
}: AppDialogContentProps) {
  return (
    <DialogContent
      showCloseButton={false}
      className={cn(
        "grid max-h-[90vh] grid-rows-[auto_1fr_auto] gap-0 p-0 overflow-hidden",
        MAX_WIDTH_CLASS[maxWidth],
        className,
      )}
    >
      {children}
    </DialogContent>
  )
}

// ---------------------------------------------------------------------------
// AppDialogHeader — ícone à esquerda + (título / descrição) à direita.
// Sticky no topo do dialog. Inclui o botão "X" de fechar (absolute, canto
// superior direito) com pr-14 no header para o título não colidir com ele.
// ---------------------------------------------------------------------------

interface AppDialogHeaderProps {
  icon?: LucideIcon | ReactNode
  iconClassName?: string
  title: ReactNode
  description?: ReactNode
  className?: string
}

function AppDialogHeader({
  icon: IconProp,
  iconClassName,
  title,
  description,
  className,
}: AppDialogHeaderProps) {
  const isComponent = typeof IconProp === "function" || (IconProp && typeof IconProp === "object" && "displayName" in (IconProp as object))
  const Icon = isComponent ? (IconProp as LucideIcon) : null
  const iconNode = Icon ? <Icon className="size-5" /> : (IconProp as ReactNode)

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex items-start gap-3 border-b bg-popover p-6 pr-14 pb-4",
        className,
      )}
    >
      {iconNode && (
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
            iconClassName,
          )}
        >
          {iconNode}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <DialogPrimitiveTitle className="font-heading text-base leading-none font-semibold tracking-tight">
          {title}
        </DialogPrimitiveTitle>
        {description && (
          <DialogPrimitiveDescription className="text-sm text-muted-foreground">
            {description}
          </DialogPrimitiveDescription>
        )}
      </div>
      <DialogPrimitiveClose asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-4 right-4"
          aria-label="Fechar"
        >
          <XIcon />
        </Button>
      </DialogPrimitiveClose>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AppDialogBody — ancorado na linha `1fr` do grid do AppDialogContent.
// `min-h-0` permite a altura encolher abaixo do conteúdo; `overflow-hidden`
// contém a ScrollArea para que o `h-full` dela resolva e a barra apareça.
// ---------------------------------------------------------------------------

interface AppDialogBodyProps {
  children: ReactNode
  className?: string
}

function AppDialogBody({ children, className }: AppDialogBodyProps) {
  return (
    <div className={cn("min-h-0 overflow-hidden", className)}>
      <ScrollArea className="h-full">
        <div className="p-6 pt-4">{children}</div>
      </ScrollArea>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AppDialogFooter — sticky embaixo, simétrico ao header.
// ---------------------------------------------------------------------------

type AppDialogFooterProps = React.ComponentProps<"div">

function AppDialogFooter({ className, children, ...props }: AppDialogFooterProps) {
  return (
    <DialogFooter
      className={cn(
        "bottom-0 z-10 gap-2 border-t bg-popover p-4 sm:flex-row sm:justify-end sm:p-6 sm:pt-4 xl:p-3",
        className,
      )}
      {...props}
    >
      {children}
    </DialogFooter>
  )
}

// ---------------------------------------------------------------------------
// AppDialogCancel — botão "Cancelar" pré-configurado (DialogClose asChild).
// ---------------------------------------------------------------------------

interface AppDialogCancelProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  children?: ReactNode
  variant?: VariantProps
}

function AppDialogCancel({
  children = "Cancelar",
  variant = "outline",
  ...props
}: AppDialogCancelProps) {
  return (
    <DialogPrimitiveClose asChild>
      <Button variant={variant} {...props}>
        {children}
      </Button>
    </DialogPrimitiveClose>
  )
}

// ---------------------------------------------------------------------------
// AppDialogAction — botão de ação primário (variants herdados do Button).
// ---------------------------------------------------------------------------

interface AppDialogActionProps extends React.ComponentProps<typeof Button> {
  size?: SizeProps
}

function AppDialogAction({
  children = "Confirmar",
  ...props
}: AppDialogActionProps) {
  return <Button {...props}>{children}</Button>
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  AppDialog,
  AppDialogAction,
  AppDialogBody,
  AppDialogCancel,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
}

// Re-export do Trigger para encurtar `import { DialogTrigger } from ...` no
// padrão `<AppDialog>...<DialogTrigger asChild>...</DialogTrigger></AppDialog>`.
export { DialogTrigger }
