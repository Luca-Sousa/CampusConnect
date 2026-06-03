import { useForm } from "@tanstack/react-form";
import { FieldGroup } from "@/components/ui/field";
import { showError, showSuccess } from "@/lib/toast";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import {
  NEWS_CONTENT_MAX,
  newsPostSchema,
  type NewsPostValues,
} from "@/features/feed/schemas";
import { buildEditBody } from "@/features/feed/utils/diff";
import { useCreateNews } from "../../hooks/use-create-news";
import { useUpdateNews } from "../../hooks/use-update-news";
import { PostImageUpload } from "@/features/feed/components/forms/post-image-upload";
import type { NewsPost } from "../../types";

export const NEWS_FORM_ID = "news-form";

interface NewsFormProps {
  onSuccess: () => void;
  mode?: "create" | "edit";
  news?: NewsPost | null;
}

export function NewsForm({
  onSuccess,
  mode = "create",
  news,
}: NewsFormProps) {
  const { mutateAsync: createNews } = useCreateNews();
  const { mutateAsync: updateNews } = useUpdateNews();

  const defaultValues = {
    newsTitle: news?.newsTitle ?? "",
    content: news?.content ?? "",
    imageUrl: news?.imageUrl ?? "",
  };

  const form = useForm({
    defaultValues: defaultValues as NewsPostValues,
    validators: { onSubmit: newsPostSchema },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "edit" && news) {
          const body = buildEditBody(
            {
              newsTitle: value.newsTitle.trim(),
              content: value.content,
              imageUrl: value.imageUrl,
            },
            {
              newsTitle: news.newsTitle ?? "",
              content: news.content ?? "",
              imageUrl: news.imageUrl ?? "",
            },
          );
          if (Object.keys(body).length === 0) {
            onSuccess();
            return;
          }
          await updateNews({ id: news.id, body });
          showSuccess("Comunicado atualizado com sucesso!");
        } else {
          const body: Record<string, unknown> = {
            type: "news",
            newsTitle: value.newsTitle.trim(),
            content: value.content.trim(),
          };
          const imageUrl = value.imageUrl?.trim();
          if (imageUrl) body.imageUrl = imageUrl;
          await createNews(body);
          showSuccess("Comunicado publicado com sucesso!");
        }
        onSuccess();
      } catch (error) {
        showError(
          error instanceof Error
            ? error.message
            : mode === "edit"
              ? "Erro ao atualizar."
              : "Erro ao publicar.",
        );
      }
    },
  });

  return (
    <form
      id={NEWS_FORM_ID}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="newsTitle">
          {(field) => (
            <FormInput
              field={field}
              label="Título do comunicado"
              placeholder="Ex: Inscrições abertas para o ENEM 2026"
            />
          )}
        </form.Field>

        <form.Field name="content">
          {(field) => (
            <FormTextarea
              field={field}
              label="Conteúdo"
              placeholder="Descreva a notícia..."
              rows={5}
              maxLength={NEWS_CONTENT_MAX}
              showCounter
            />
          )}
        </form.Field>

        <form.Field name="imageUrl">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <PostImageUpload
                id={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                isInvalid={isInvalid}
                errors={field.state.meta.errors}
                label="Imagem do comunicado (opcional)"
                description="Adicione uma imagem de capa para o comunicado."
              />
            );
          }}
        </form.Field>
      </FieldGroup>
    </form>
  );
}
