import { useQuery } from "@tanstack/react-query";
import { fetchGroupMessages } from "../api";
import { groupKeys } from "../query-keys";

export function useGroupMessages(groupId: string | null) {
  return useQuery({
    queryKey: groupKeys.messages(groupId ?? ""),
    queryFn: () => fetchGroupMessages(groupId!),
    enabled: !!groupId,
  });
}
