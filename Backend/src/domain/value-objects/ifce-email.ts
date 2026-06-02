export const ALUNO_DOMAIN = "@aluno.ifce.edu.br" as const;
export const IFCE_DOMAIN = "@ifce.edu.br" as const;

export const isAlunoEmail = (email: string): boolean =>
  email.toLowerCase().endsWith(ALUNO_DOMAIN);

export const isIfceEmail = (email: string): boolean =>
  email.toLowerCase().endsWith(IFCE_DOMAIN);

export const isColaboradorEmail = (email: string): boolean =>
  isIfceEmail(email) && !isAlunoEmail(email);

export const isValidIfceEmail = (email: string): boolean =>
  isAlunoEmail(email) || isIfceEmail(email);
