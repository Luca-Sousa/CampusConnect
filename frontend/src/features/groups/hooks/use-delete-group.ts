import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { deleteGroup } from "../api";
import { groupKeys } from "../query-keys";
import type { Group } from "../types";

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Group[]>(groupKeys.list(), (old = []) =>
        old.filter((g) => g.id !== id),
      );
    },
    onError: () => {
      showError("Erro ao remover grupo.");
    },
  });
}
