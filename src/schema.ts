import type { z } from 'zod';

// biome-ignore lint/suspicious/noExplicitAny: allowed in this specific case
export type EnvZodType = z.ZodType<any, any, string>;

export type EnvConfigSchema = {
    [K in string]: EnvConfigSchema | EnvZodType;
};

export type EnvConfig<T extends EnvConfigSchema> = {
    [K in keyof T]: T[K] extends EnvConfigSchema ? EnvConfig<T[K]> : T[K] extends EnvZodType ? z.output<T[K]> : never;
};

type Identity<T> = T;
export type Flatten<T> = Identity<{ [K in keyof T]: T[K] }>;
