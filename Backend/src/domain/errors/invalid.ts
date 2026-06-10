export class InvalidError extends Error {
  constructor(message = "Dados inválidos.") {
    super(message);
    this.name = "InvalidError";
  }
}
