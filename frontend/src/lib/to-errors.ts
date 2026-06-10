type FieldError = string | { message?: string } | undefined;

export function toErrors(
  errors: FieldError[] | undefined,
): { message?: string }[] {
  return (errors ?? []).map((e) => ({
    message: typeof e === "string" ? e : e?.message,
  }));
}
