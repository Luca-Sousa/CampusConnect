import { useState } from "react";
import {
  NewspaperIcon,
  RssIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { PageHeader } from "@/components/page-header";
import { useNews } from "@/features/news/hooks/use-news";
import { NewsComposer } from "@/features/news/components/NewsComposer";
import { NewsCard } from "@/features/news/components/NewsCard";
import { NewsListSkeleton } from "@/features/news/components/NewsListSkeleton";
import { OFFICIAL_CARGOS } from "@/features/auth/constants";
import type { CargoValue } from "@/features/auth/types";
import type { NewsPost } from "@/features/news/types";

const NewsPage = () => {
  const { data: session } = useSession();
  const { data: news = [], isLoading } = useNews();
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);

  const userRole =
    (session?.user as { role?: string } | undefined)?.role ?? "";
  const userCargo =
    (session?.user as { cargo?: string } | undefined)?.cargo ?? "";
  const canPublish =
    userRole === "admin" || OFFICIAL_CARGOS.has(userCargo as CargoValue);

  const latest = news[0];
  const rest = news.slice(1);

  return (
    <div className="min-h-screen">
      <PageHeader
        icon={NewspaperIcon}
        iconClassName="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        title="Notícias"
        subtitle="Comunicados oficiais do campus"
        action={
          <NewsComposer
            editingNews={editingNews}
            onEditClose={() => setEditingNews(null)}
            canPublish={canPublish}
          />
        }
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <NewsListSkeleton />
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 p-6 mb-5">
              <RssIcon className="h-12 w-12 text-amber-400 dark:text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Nenhum comunicado
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {canPublish
                ? "Publique o primeiro comunicado oficial para a comunidade do campus."
                : "Ainda não há comunicados oficiais publicados."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured — última notícia */}
            {latest && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    Destaque
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <NewsCard
                  news={latest}
                  currentUserId={session?.user?.id}
                  currentUserRole={userRole}
                  currentUserCargo={userCargo}
                  onEdit={setEditingNews}
                  variant="featured"
                />
              </section>
            )}

            {/* Lista de notícias */}
            {rest.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Mais comunicados
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-3">
                  {rest.map((item) => (
                    <NewsCard
                      key={item.id}
                      news={item}
                      currentUserId={session?.user?.id}
                      currentUserRole={userRole}
                      currentUserCargo={userCargo}
                      onEdit={setEditingNews}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Footer info */}
            {!canPublish && (
              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground pt-4 border-t border-border">
                <ShieldAlertIcon className="h-3.5 w-3.5" />
                Apenas perfis oficiais podem publicar comunicados.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
