import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Request} from "express";
import {raise} from "backend-batteries";
import {RefreshTokenRequired} from "../auth.exceptions";

export const RefreshTokenBody = createParamDecorator(
    (data: {optional?: boolean} | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const refreshToken = request.cookies?.["refreshToken"];
        if (!refreshToken && !data?.optional) {
            raise(RefreshTokenRequired);
        }
        return refreshToken;
    },
);
