import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/lib/toast";
import { feedKeys } from "@/features/feed/query-keys";
import { groupKeys } from "@/features/groups/query-keys";
import { updateProfile } from "../api";
import type { UpdateProfileInput } from "../types";

interface UseUpdateProfileOptions {
  onSuccess?: () => void;
}

export function useUpdateProfile(options?: UseUpdateProfileOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: async () => {
      showSuccess("Perfil atualizado com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: feedKeys.posts() });
      await queryClient.invalidateQueries({ queryKey: groupKeys.all });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      showError(error.message ?? "Erro ao atualizar perfil.");
    },
  });
}
