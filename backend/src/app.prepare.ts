import {INestApplication} from "@nestjs/common";
import {ISettings} from "./common/settings/settings.types";
import * as cookieParser from "cookie-parser";
import {HttpAdapterHost} from "@nestjs/core";
import {AllExceptionsFilter} from "./helpers/exceptions/all-exceptions.filter";
import {AppExceptionsFilter} from "./helpers/exceptions/app-exceptions.filter";
import {ZodValidationExceptionFilter} from "./helpers/exceptions/zod-exception.filter";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export async function prepareApp(app: INestApplication, settings: ISettings, extra: {withSwagger?: boolean}) {
    app.use(cookieParser());
    {
        // exceptions filters
        const {httpAdapter} = app.get(HttpAdapterHost);
        app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
        app.useGlobalFilters(new AppExceptionsFilter(httpAdapter));
        app.useGlobalFilters(new ZodValidationExceptionFilter(httpAdapter));
    }
    if (extra.withSwagger) {
        // swagger
        const swaggerConfig = new DocumentBuilder()
            .setTitle(settings.APP_NAME)
            .setDescription(`The ${settings.APP_NAME} API description`)
            .setVersion(settings.APP_VERSION).addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup(settings.SWAGGER_URL_PREFIX, app, document);
    }
}