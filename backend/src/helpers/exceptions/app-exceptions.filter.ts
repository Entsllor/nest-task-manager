import {AppException} from "backend-batteries";
import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {Response} from "express";
import {omit} from "radash";

@Catch(AppException)
export class AppExceptionsFilter implements ExceptionFilter {
    catch(exception: AppException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const body = exception.toJSON();
        response.status(exception.status).json({...omit(body, ["status"]), statusCode: body.status});
    }
}