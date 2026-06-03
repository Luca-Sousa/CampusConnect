import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { updateGroup } from "../api";
import { groupKeys } from "../query-keys";
import type { Group } from "../types";

interface UpdateGroupVariables {
  id: string;
  body: { name?: string; description?: string | null; icon?: string | null };
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: UpdateGroupVariables) => updateGroup(id, body),

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: groupKeys.list() });

      const previousGroups = queryClient.getQueryData<Group[]>(
        groupKeys.list(),
      );

      queryClient.setQueryData<Group[]>(groupKeys.list(), (old = []) =>
        old.map((g) => (g.id === id ? { ...g, ...body } : g)),
      );

      return { previousGroups };
    },

    onError: (_error: Error, _variables, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(groupKeys.list(), context.previousGroups);
      }
      showError("Erro ao atualizar grupo.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}
