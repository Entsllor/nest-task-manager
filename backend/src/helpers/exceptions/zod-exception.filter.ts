import {ZodValidationException} from "nestjs-zod";
import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {Response} from "express";

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ZodValidationException, host: ArgumentsHost) {
        const exc = exception.getZodError();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.status(422).json({status: 422, errors: exc.errors, message: 'Unprocessable Entity', error: "VALIDATION_ERROR"});
    }
}