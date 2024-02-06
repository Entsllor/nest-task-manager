import {AppException} from "backend-batteries";
import {ArgumentsHost, Catch} from "@nestjs/common";
import {Response} from "express";
import {omit} from "radash";
import {BaseExceptionFilter} from "@nestjs/core";

@Catch(AppException)
export class AppExceptionsFilter extends BaseExceptionFilter {
    catch(exception: AppException, host: ArgumentsHost): any {
        const applicationRef = this.applicationRef || (this.httpAdapterHost && this.httpAdapterHost.httpAdapter)!;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const body = exception.toJSON();
        applicationRef.reply(
            response,
            {...omit(body, ["status"]), statusCode: body.status},
            exception.status,
        );
    }
}