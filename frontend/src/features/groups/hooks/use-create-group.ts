import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { createGroup } from "../api";
import { groupKeys } from "../query-keys";
import type { Group } from "../types";

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; description?: string }) =>
      createGroup(body),
    onSuccess: (newGroup) => {
      queryClient.setQueryData<Group[]>(groupKeys.list(), (old = []) => [
        newGroup,
        ...old,
      ]);
    },
    onError: (error: Error) => {
      showError(error.message || "Erro ao criar grupo.");
    },
  });
}
