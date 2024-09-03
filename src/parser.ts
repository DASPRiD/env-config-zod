import * as changeCase from "change-case";
import { z, type ZodIssue } from 'zod';
import type { EnvConfig, EnvConfigSchema, Flatten } from './schema.js';

export type EnvConfigIssue = {
    name: string;
    issues: ZodIssue[];
};

export class EnvConfigError extends Error {
    public readonly issues: EnvConfigIssue[];

    public constructor(issues: EnvConfigIssue[]) {
        super("Failed to parse env config");

        this.issues = issues;
    }
}

export const parseEnvConfig = <T extends EnvConfigSchema>(schema: T, prefix = "", env = process.env): Flatten<EnvConfig<T>> => {
    const config: Record<string, unknown> = {};
    const issues: EnvConfigIssue[] = [];

    for (const [key, value] of Object.entries(schema)) {
        const envKey = `${prefix}${changeCase.constantCase(key)}`;

        if (value instanceof z.ZodType) {
            const parseResult = value.safeParse(env[envKey]);

            if (parseResult.success) {
                config[key] = parseResult.data;
                continue;
            }

            issues.push({
                name: envKey,
                issues: parseResult.error.issues,
            });

            continue;
        }

        try {
            config[key] = parseEnvConfig(value, `${envKey}_`, env);
        } catch (error) {
            if (!(error instanceof EnvConfigError)) {
                throw error;
            }

            issues.push(...error.issues);
        }
    }

    if (issues.length > 0) {
        throw new EnvConfigError(issues);
    }

    return config as EnvConfig<T>;
};
