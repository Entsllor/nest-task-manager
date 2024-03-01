import {Response} from "supertest";
import {ZodType} from "nestjs-zod/z";
import {ZodDto} from "nestjs-zod";
import {isZodDto} from "nestjs-zod/dto";

export function doSatisfies(
    schema: ZodType | ZodDto,
) {
    return (response: Response) => {
        const body = response.body as Record<any, any>;
        if (isZodDto(schema)) {
            schema = schema.schema
        }
        expect(() => (schema as ZodType).parse(body)).not.toThrow();
    };
}