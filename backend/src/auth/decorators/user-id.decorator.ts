import {createParamDecorator, ExecutionContext, UnauthorizedException} from "@nestjs/common";
import {Request} from "express";
import {raise} from "backend-batteries";


export const UserId = createParamDecorator((_data: unknown, input: ExecutionContext) => {
    const req: Request = input.switchToHttp().getRequest();
    return (req.user as any)?.sub ?? raise(UnauthorizedException);
});
