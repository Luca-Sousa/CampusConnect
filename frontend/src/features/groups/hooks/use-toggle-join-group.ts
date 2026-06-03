import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { toggleJoinGroup } from "../api";
import { groupKeys } from "../query-keys";
import type { Group } from "../types";

export function useToggleJoinGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleJoinGroup(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: groupKeys.list() });

      const previousGroups = queryClient.getQueryData<Group[]>(
        groupKeys.list(),
      );

      queryClient.setQueryData<Group[]>(groupKeys.list(), (old = []) =>
        old.map((g) =>
          g.id === id
            ? {
                ...g,
                isMember: !g.isMember,
                memberCount: g.isMember
                  ? g.memberCount - 1
                  : g.memberCount + 1,
              }
            : g,
        ),
      );

      return { previousGroups };
    },

    onError: (_error: Error, _variables, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(groupKeys.list(), context.previousGroups);
      }
      showError("Erro ao entrar no grupo.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
}
