import {applyDecorators} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {skipFalsy} from "backend-batteries";

export const OpenApiSettings = (tag: string, options: {auth: 'bearer' | 'public'} = {auth: "bearer"}) => applyDecorators(
    ...skipFalsy(
        options.auth === 'bearer' && ApiBearerAuth(),
        ApiTags(tag),
    ),
);