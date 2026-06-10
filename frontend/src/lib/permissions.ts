import { OFFICIAL_CARGOS } from "@/features/auth/constants";
import type { CargoValue } from "@/features/auth/types";

export function canModeratePost(
  currentUserRole?: string,
  currentUserCargo?: string,
): boolean {
  if (currentUserRole === "admin") return true;
  if (currentUserRole === "colaborador") {
    return OFFICIAL_CARGOS.has((currentUserCargo ?? "") as CargoValue);
  }
  return false;
}
