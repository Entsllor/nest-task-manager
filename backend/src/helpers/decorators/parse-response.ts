import {ApiResponse, ApiResponseMetadata} from "@nestjs/swagger";
import {ZodDto, ZodSerializerDto} from "nestjs-zod";
import {applyDecorators} from "@nestjs/common";

type AcceptableDto = ZodDto

export function ParseResponse(options: ApiResponseMetadata & {type: AcceptableDto}) {
    return applyDecorators(
        ZodSerializerDto(options.type),
        ApiResponse(options),
    );
}