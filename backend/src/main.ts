import {patchNestJsSwagger} from "nestjs-zod";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {Settings} from "./common/settings/settings.service";

import {prepareApp} from "./app.prepare";

patchNestJsSwagger();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const settings = app.get(Settings).vars;
    await prepareApp(app, settings, {withSwagger: true});
    await app.listen(settings.BACKEND_PORT);
}

bootstrap();
