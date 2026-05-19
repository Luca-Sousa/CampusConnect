export type CargoValue =
  | "aluno"
  | "professor"
  | "coordenador"
  | "direcao"
  | "administracao"
  | "secretaria"
  | "centro_academico"
  | "biblioteca"
  | "ti";

export interface CargoOption {
  readonly value: CargoValue;
  readonly label: string;
}

export interface CargoBadgeConfig {
  readonly label: string;
  readonly className: string;
}
