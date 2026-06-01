/**
 * Fábrica centralizada de chaves para TanStack Query.
 *
 * Todas as queries e mutações do feed referenciam estas chaves,
 * garantindo invalidação consistente do cache.
 */
export const feedKeys = {
  all: ["feed"] as const,
  posts: () => [...feedKeys.all, "posts"] as const,
} as const;
