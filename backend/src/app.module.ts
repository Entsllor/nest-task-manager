import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ConfigModule} from "@nestjs/config";
import {configSchema} from "./types/config";
import {Settings} from "./providers/settings/settings.service";

@Module({
    imports: [ConfigModule.forRoot({validate: configSchema.parse})],
    controllers: [AppController],
    providers: [AppService, Settings],
})
export class AppModule {
}
