import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {omit} from "radash";

export const JwtPayload = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return omit(request.user, ['exp']);
    },
);