import {Response} from "supertest";
import {ZodType} from "nestjs-zod/z";

export function doSatisfies(
    schema: ZodType,
) {
    return (response: Response) => {
        const body = response.body as Record<any, any>;
        expect(() => schema.parse(body)).not.toThrow();
    };
}