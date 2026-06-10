interface FormatZodErrorsInput {
  error: {
    validationContext?: string;
    validation?: Array<{
      instancePath?: string;
      keyword?: string;
      message: string;
      params?: {
        type?: string;
        missingProperty?: string;
      };
    }>;
  };
}

export function formatZodErrors({ error }: FormatZodErrorsInput) {
  const validationContext = error.validationContext || "body";

  const formattedError = {
    message: "Invalid input",
    validation: [] as Array<{
      field: string;
      message: string;
      code: string;
      context: string;
    }>,
  };

  if (Array.isArray(error.validation)) {
    for (const issue of error.validation) {
      let field = issue.instancePath?.replace(/^\//, "") || "";

      if (
        issue.keyword === "invalid_type" &&
        issue.params?.type === "required"
      ) {
        field = (issue.params.missingProperty as string) || field;
      }

      formattedError.validation.push({
        field,
        message: issue.message || "Validation error",
        code: issue.keyword || "unknown",
        context: validationContext,
      });
    }
  }

  return formattedError;
}
