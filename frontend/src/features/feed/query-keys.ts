/**
 * Fábrica centralizada de chaves para TanStack Query.
 *
 * Todas as queries e mutações do feed referenciam estas chaves,
 * garantindo invalidação consistente do cache.
 */
export const feedKeys = {
  all: ["feed"] as const,
  posts: () => [...feedKeys.all, "posts"] as const,
  postDetail: (id: string) => [...feedKeys.all, "post", id] as const,
  postLike: (id: string) => [...feedKeys.all, "like", id] as const,
  postComments: (id: string) => [...feedKeys.all, "comments", id] as const,
} as const;
