import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { deleteGroupMessage } from "../api";
import { groupKeys } from "../query-keys";
import type { GroupMessage } from "../types";

interface DeleteGroupMessageVariables {
  groupId: string;
  messageId: string;
}

export function useDeleteGroupMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId }: DeleteGroupMessageVariables) =>
      deleteGroupMessage(messageId),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<GroupMessage[]>(
        groupKeys.messages(variables.groupId),
        (old = []) => old.filter((m) => m.id !== variables.messageId),
      );
    },
    onError: () => {
      showError("Erro ao remover mensagem.");
    },
  });
}
