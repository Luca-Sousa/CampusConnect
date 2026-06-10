export class ForbiddenError extends Error {
  constructor(message = "Sem permissão.") {
    super(message);
    this.name = "ForbiddenError";
  }
}
