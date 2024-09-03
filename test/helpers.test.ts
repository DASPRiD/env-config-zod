import { describe, expect, it } from 'vitest';
import { booleanSchema } from '../src/index.js';

describe("booleanSchema", () => {
    it("should parse 'true' as true", () => {
        const value = booleanSchema.parse("true");
        expect(value).toStrictEqual(true);
    });

    it("should parse 'trUE' as true", () => {
        const value = booleanSchema.parse("trUE");
        expect(value).toStrictEqual(true);
    });

    it("should parse 'false' as false", () => {
        const value = booleanSchema.parse("false");
        expect(value).toStrictEqual(false);
    });

    it("should parse '0' as false", () => {
        const value = booleanSchema.parse("0");
        expect(value).toStrictEqual(false);
    });

    it("should parse '1' as true", () => {
        const value = booleanSchema.parse("1");
        expect(value).toStrictEqual(true);
    });

    it("should parse '2' as false", () => {
        const value = booleanSchema.parse("2");
        expect(value).toStrictEqual(false);
    });
});
