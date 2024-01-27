import {ZodSchema} from "zod";

export function expectSchema<T>(schema: ZodSchema<T>, data: T): T {
    expect(data).toStrictEqual(schema.parse(data));
    return data
}