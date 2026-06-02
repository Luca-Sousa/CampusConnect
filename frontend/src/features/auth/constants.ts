import type { CargoBadgeConfig, CargoOption, CargoValue } from "./types";

export const CARGO_OPTIONS: readonly CargoOption[] = [
  { value: "professor", label: "Professor(a)" },
  { value: "coordenador", label: "Coordenador(a) de Curso" },
  { value: "direcao", label: "Direção" },
  { value: "administracao", label: "Administração" },
  { value: "secretaria", label: "Secretaria Acadêmica" },
  { value: "centro_academico", label: "Centro Acadêmico (C.A.)" },
  { value: "biblioteca", label: "Biblioteca" },
  { value: "ti", label: "TI" },
] as const;

export const CARGO_CONFIG: Record<CargoValue | string, CargoBadgeConfig> = {
  aluno: {
    label: "Aluno",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  professor: {
    label: "Professor(a)",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  coordenador: {
    label: "Coordenador(a)",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  direcao: {
    label: "Direção",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  administracao: {
    label: "Administração",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  secretaria: {
    label: "Secretaria",
    className:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  },
  centro_academico: {
    label: "C.A.",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  biblioteca: {
    label: "Biblioteca",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  ti: {
    label: "TI",
    className:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  },
};

export const DEFAULT_CARGO_CONFIG: CargoBadgeConfig = {
  label: "Colaborador",
  className: "bg-secondary text-secondary-foreground",
};

/** Cargos com permissão para publicar comunicados/notícias oficiais. */
export const OFFICIAL_CARGOS: ReadonlySet<CargoValue> = new Set([
  "direcao",
  "administracao",
  "coordenador",
  "centro_academico",
]);
