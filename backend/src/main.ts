import {patchNestJsSwagger} from "nestjs-zod";
import {HttpAdapterHost, NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {Settings} from "./common/settings/settings.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppExceptionsFilter} from "./helpers/exceptions/app-exceptions.filter";
import {AllExceptionsFilter} from "./helpers/exceptions/all-exceptions.filter";
import {ZodValidationExceptionFilter} from "./helpers/exceptions/zod-exception.filter";

patchNestJsSwagger();


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const settings = app.get(Settings).vars;
    const swaggerConfig = new DocumentBuilder()
        .setTitle(settings.APP_NAME)
        .setDescription(`The ${settings.APP_NAME} API description`)
        .setVersion(settings.APP_VERSION)
        .build();
    const port = settings.BACKEND_PORT;
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    const {httpAdapter} = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalFilters(new AppExceptionsFilter(httpAdapter));
    app.useGlobalFilters(new ZodValidationExceptionFilter(httpAdapter));
    SwaggerModule.setup(settings.SWAGGER_URL_PREFIX, app, document);
    await app.listen(port);
}


bootstrap();
