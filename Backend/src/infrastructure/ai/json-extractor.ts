export function extractJsonFromText<T>(text: string): T | null {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      return JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as T;
    } catch {
      return null;
    }
  }

  return null;
}

export function extractJsonArrayFromText<T>(text: string): T[] | null {
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]");

  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      return JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as T[];
    } catch {
      return null;
    }
  }

  return null;
}
