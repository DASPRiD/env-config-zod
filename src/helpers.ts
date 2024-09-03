import { z } from "zod";

export const booleanSchema = z
    .string()
    .transform((value) => value.toLowerCase() === "true" || value === "1");
