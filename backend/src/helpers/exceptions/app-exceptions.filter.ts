import {AppException} from "backend-batteries";
import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {Response} from "express";

@Catch(AppException)
export class AppExceptionsFilter implements ExceptionFilter {
    catch(exception: AppException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.status(exception.status).json(exception.toJSON());
    }
}