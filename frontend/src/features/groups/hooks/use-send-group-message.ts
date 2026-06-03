import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/toast";
import { sendGroupMessage } from "../api";
import { groupKeys } from "../query-keys";
import type { GroupMessage } from "../types";

interface SendGroupMessageVariables {
  groupId: string;
  content: string;
}

export function useSendGroupMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, content }: SendGroupMessageVariables) =>
      sendGroupMessage(groupId, content),

    onSuccess: (newMessage) => {
      queryClient.setQueryData<GroupMessage[]>(
        groupKeys.messages(newMessage.groupId),
        (old = []) => [newMessage, ...old],
      );
    },
    onError: (error: Error) => {
      showError(error.message || "Erro ao enviar mensagem.");
    },
  });
}
