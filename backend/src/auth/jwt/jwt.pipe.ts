import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Request} from "express";
import {raise} from "backend-batteries";
import {AccessTokenRequired} from "../auth.exceptions";
import {getAccessTokenFromRequest} from "./jwt.helpers";

export const AccessTokenBody = createParamDecorator(
    (data: {optional?: boolean} | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const accessToken = getAccessTokenFromRequest(request);
        if (!accessToken && !data?.optional) {
            raise(AccessTokenRequired);
        }
        return accessToken;
    },
);
