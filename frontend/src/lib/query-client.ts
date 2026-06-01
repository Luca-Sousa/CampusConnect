import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Dados considerados "frescos" por 2 minutos.
       * Durante este período nenhum refetch automático ocorre.
       */
      staleTime: 2 * 60 * 1000,
      /**
       * Cache mantido por 10 minutos após todos os observers desmontarem.
       * Ao remontar, o cache é entregue instantaneamente enquanto o refetch
       * ocorre em background.
       */
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
