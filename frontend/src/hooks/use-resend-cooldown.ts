import { useState, useEffect } from "react";

/**
 * Gerencia o cooldown de reenvio de código (ex: OTP).
 * @param initialSeconds - Segundos iniciais de espera. Use 0 para não iniciar automaticamente.
 */
export function useResendCooldown(initialSeconds = 60) {
  const [cooldown, setCooldown] = useState(initialSeconds);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const startCooldown = (seconds = initialSeconds) => setCooldown(seconds);

  return { cooldown, startCooldown };
}
