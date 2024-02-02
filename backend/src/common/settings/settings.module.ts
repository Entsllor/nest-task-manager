import {Module} from "@nestjs/common";
import {Settings} from "./settings.service";
import {ConfigModule} from "@nestjs/config";
import {AppMode, configSchema} from "./settings.types";


@Module({
    imports: [ConfigModule.forRoot({
        validate: configSchema.parse,
        envFilePath: process.env.NODE_ENV === AppMode.test ? "../.env.test" : "../.env",
    })],
    providers: [Settings],
})
export class SettingsModule {
}
