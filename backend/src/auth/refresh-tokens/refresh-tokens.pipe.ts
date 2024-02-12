import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Request} from "express";
import {raise} from "backend-batteries";
import {RefreshTokenRequired} from "../auth.exceptions";

export const RefreshTokenBody = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        return request.cookies?.["refreshToken"] || raise(RefreshTokenRequired);
    },
);
