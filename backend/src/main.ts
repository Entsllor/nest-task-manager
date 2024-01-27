import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {Settings} from "./common/settings/settings.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {AppExceptionsFilter} from "./helpers/exceptions/app-exceptions.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const settings = app.get(Settings).vars;
    const swaggerConfig = new DocumentBuilder()
        .setTitle(settings.APP_NAME)
        .setDescription(`The ${settings.APP_NAME} API description`)
        .setVersion(settings.APP_VERSION)
        .build();
    const port = settings.PORT;
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    app.useGlobalFilters(new AppExceptionsFilter());
    SwaggerModule.setup(settings.SWAGGER_URL_PREFIX, app, document);
    await app.listen(port);
}

bootstrap();
