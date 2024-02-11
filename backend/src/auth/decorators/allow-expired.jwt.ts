import {applyDecorators, UseGuards} from "@nestjs/common";
import {Public} from "./public.decorator";
import {ExpiredJwtAuthGuard} from "../jwt/expired-jwt-auth.guard";

export const AllowExpiredJwt = () => applyDecorators(
    Public(),
    UseGuards(ExpiredJwtAuthGuard),
);
