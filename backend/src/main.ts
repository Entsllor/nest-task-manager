import {patchNestJsSwagger} from "nestjs-zod";
import {HttpAdapterHost, NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {Settings} from "./common/settings/settings.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppExceptionsFilter} from "./helpers/exceptions/app-exceptions.filter";
import {AllExceptionsFilter} from "./helpers/exceptions/all-exceptions.filter";
import {ZodValidationExceptionFilter} from "./helpers/exceptions/zod-exception.filter";
import * as cookieParser from "cookie-parser";

patchNestJsSwagger();


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    const settings = app.get(Settings).vars;

    {
        // exceptions filters
        const {httpAdapter} = app.get(HttpAdapterHost);
        app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
        app.useGlobalFilters(new AppExceptionsFilter(httpAdapter));
        app.useGlobalFilters(new ZodValidationExceptionFilter(httpAdapter));
    }

    {
        // swagger
        const swaggerConfig = new DocumentBuilder()
            .setTitle(settings.APP_NAME)
            .setDescription(`The ${settings.APP_NAME} API description`)
            .setVersion(settings.APP_VERSION).addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup(settings.SWAGGER_URL_PREFIX, app, document);
    }

    await app.listen(settings.BACKEND_PORT);
}


bootstrap();
