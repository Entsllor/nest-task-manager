import {BaseExceptionFilter} from "@nestjs/core";
import {ArgumentsHost, Catch} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        super.catch(exception, host);
        try {
            console.error(exception);
        } catch {
        }
    }
}