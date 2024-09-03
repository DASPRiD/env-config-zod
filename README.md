# Env Config Zod

[![Release](https://github.com/DASPRiD/env-config-zod/actions/workflows/release.yml/badge.svg)](https://github.com/DASPRiD/env-config-zod/actions/workflows/release.yml)

A simply utility to parse environment variables into config objects using [Zod](https://github.com/colinhacks/zod).

## Installation

### npm
```bash
npm i env-config-zod zod
```

### pnpm
```bash
pnpm add env-config-zod zod
```

Please note that `zod` is just a peer dependency of this library and is installed separately.

## Usage

Simply import the config parser and supply it with a schema:

```typescript
import {parseEnvConfig} from "env-config-zod";

const envConfig = parseEnvConfig({
    database: {
        hostname: z.string().min(1),
        port: z.coerce.number.int().min(1).max(65_535),
        username: z.string().min(1),
        password: z.string().min(1),
    },
});
```

The parsed env config will have proper resolved TypeScript types for you. The above config would parse the following
environment variables:

- `DATABASE_HOSTNAME`
- `DATABASE_PORT`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

### Case conversion

While parsing, this library converts any object key to "CONSTANT_CASE" in order to read from the environment. It doesn't
matter whether you use camelCase, PascalCase or anything else for your property names.

### Custom prefix

If you want to prefix all your environment variables to avoid collisions with other things, you can pass a prefix as
the second parameter to `parseEnvConfig`, e.g. `APP_`.

### Helpers schemas

Parsing specific types can be repetitive when defining a config schema. Thus, this library exports common schemas:

#### Boolean schema

You can use `booleanSchema` in order to parse any boolean values. Any value matching the string `"true"` or `"1"`
(case-insensitive) will evaluate to `true`, anything else will evaluate to `false`.

### Schema safety

The type definition of `EnvConfigSchema` makes sure that you only pass in Zod schemas which accept strings as input.
Thus, you cannot pass types which would always fail validation, like `z.number()`.
