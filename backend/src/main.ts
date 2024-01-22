import {NestFactory} from "@nestjs/core"
import {AppModule} from "./app.module"
import {Settings} from "./providers/settings/settings.service"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const port = app.get(Settings).get("PORT", 3000)
    await app.listen(port)
}

bootstrap()
