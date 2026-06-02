/**
 * Traduções PT-BR das mensagens de erro do Better Auth.
 */
export const ptBR: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha inválidos.",
  INVALID_EMAIL: "E-mail inválido.",
  INVALID_PASSWORD: "Senha inválida.",
  PASSWORD_TOO_SHORT: "A senha deve ter pelo menos 8 caracteres.",
  PASSWORD_TOO_LONG: "A senha é muito longa.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Já existe uma conta com este e-mail.",
  USER_NOT_FOUND: "Usuário não encontrado.",
  FAILED_TO_CREATE_USER: "Não foi possível criar o usuário.",
  FAILED_TO_CREATE_SESSION: "Não foi possível criar a sessão.",
  EMAIL_NOT_VERIFIED:
    "E-mail não verificado. Verifique seu e-mail para continuar.",
  SESSION_EXPIRED: "Sessão expirada. Faça login novamente.",
  OTP_EXPIRED: "O código expirou. Solicite um novo.",
  INVALID_OTP: "Código inválido.",
  TOO_MANY_ATTEMPTS: "Muitas tentativas. Aguarde e solicite um novo código.",
};
