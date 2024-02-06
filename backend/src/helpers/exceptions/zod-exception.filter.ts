import {ZodValidationException} from "nestjs-zod";
import {ArgumentsHost, Catch} from "@nestjs/common";
import {Response} from "express";
import {BaseExceptionFilter} from "@nestjs/core";

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter extends BaseExceptionFilter {
    catch(exception: ZodValidationException, host: ArgumentsHost) {
        const applicationRef = this.applicationRef || (this.httpAdapterHost && this.httpAdapterHost.httpAdapter)!;
        const exc = exception.getZodError();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        applicationRef.reply(response, {
            status: 422,
            errors: exc.errors,
            message: "Unprocessable Entity",
            error: "VALIDATION_ERROR",
        }, 422);
    }
}