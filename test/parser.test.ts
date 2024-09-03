import { assert, expect, it } from 'vitest';
import { z } from 'zod';
import { EnvConfigError, parseEnvConfig } from '../src/index.js';

it("should parse simple config", () => {
    const envConfig = parseEnvConfig(
        {
            foo: z.string(),
        },
        "",
        {
            FOO: "bar",
        },
    );

    expect(envConfig).toEqual({
        foo: "bar",
    });
});

it("should parse nested configs", () => {
    const envConfig = parseEnvConfig(
        {
            foo: {
                bar: z.string(),
            },
        },
        "",
        {
            FOO_BAR: "baz",
        },
    );

    expect(envConfig).toEqual({
        foo: {
            bar: "baz",
        },
    });
});

it("should convert camel case to constant case", () => {
    const envConfig = parseEnvConfig(
        {
            fooBar: z.string(),
        },
        "",
        {
            FOO_BAR: "baz",
        },
    );

    expect(envConfig).toEqual({
        fooBar: "baz",
    });
});

it("should emit combined issues", () => {
    try {
        parseEnvConfig(
            {
                foo: z.string(),
                bar: z.string(),
            },
            "",
            {},
        );

        assert.fail("Expected error was not thrown");
    } catch (error) {
        expect(error).toBeInstanceOf(EnvConfigError);
        expect((error as EnvConfigError).issues).toMatchSnapshot();
    }
});

it("should collect nested issues", () => {
    try {
        parseEnvConfig(
            {
                foo: z.string(),
                bar: {
                    bat: z.string(),
                },
                baz: {
                    bat: z.string(),
                },
            },
            "",
            {},
        );

        assert.fail("Expected error was not thrown");
    } catch (error) {
        expect(error).toBeInstanceOf(EnvConfigError);
        expect((error as EnvConfigError).issues).toMatchSnapshot();
    }
});
