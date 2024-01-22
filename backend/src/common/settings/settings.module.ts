import {Module} from "@nestjs/common";
import {Settings} from "./settings.service";
import {ConfigModule} from "@nestjs/config";
import {configSchema} from "./settings.types";

@Module({
    imports: [ConfigModule.forRoot({validate: configSchema.parse})],
    providers: [Settings],
})
export class SettingsModule {
}
