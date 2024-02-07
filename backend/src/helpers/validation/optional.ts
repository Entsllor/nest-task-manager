import {ZodOptional, ZodType} from "nestjs-zod/z";

export function Optional<T extends ZodType>(t: T): ZodOptional<T> {
    return t.nullable().optional().transform(arg => arg ?? undefined) as any;
}