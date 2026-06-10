/**
 * Helpers tipados para toasts do Sonner.
 * Centraliza configurações e garante consistência visual em toda a aplicação.
 */
import { toast } from "sonner";

export const showSuccess = (message: string, duration?: number): void => {
  toast.success(message, duration !== undefined ? { duration } : undefined);
};

export const showError = (message: string): void => {
  toast.error(message);
};

export const showInfo = (message: string): void => {
  toast.info(message);
};

export const showWarning = (message: string): void => {
  toast.warning(message);
};
