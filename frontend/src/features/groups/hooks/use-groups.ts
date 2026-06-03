import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../api";
import { groupKeys } from "../query-keys";

export function useGroups() {
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: groupKeys.search(search),
    queryFn: () => fetchGroups(0, 100, search || undefined),
  });

  return { ...query, search, setSearch };
}
