// Valida em runtime que a variável está definida.
// O tipo de import.meta.env já é garantido pelo env.d.ts em compile time.
function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`[env] Variável de ambiente ausente: ${key}`);
  return value;
}

export const env = {
  API_URL: requireEnv("VITE_API_URL"),
} as const;
