import { ZodType } from "zod";


/**
 * Validates data against a Zod schema.
 * Throws a descriptive error if validation fails.
 */
export function validateData<T>(schema: ZodType<T>, data: unknown, errorMessage: string = "Validation failed"): T {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error(errorMessage);
  }

  return parsed.data;
}