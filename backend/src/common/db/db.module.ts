import {Module} from "@nestjs/common";
import {Settings} from "../settings/settings.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SettingsModule} from "../settings/settings.module";
import {getDbSettings} from "./db.settings";
import {join} from "path";
import {BASE_PATH, SRC_PATH} from "../../helpers/paths";


@Module({
    imports: [SettingsModule, TypeOrmModule.forRootAsync({
        imports: [SettingsModule],
        inject: [Settings],
        useFactory: (settings: Settings) => ({
            ...getDbSettings(settings.vars),
            migrations: [join(BASE_PATH, "migrations", "*.{ts,js}")],
            autoLoadEntities: true,
            entities: [join(SRC_PATH, "**", "*.model.js")],
        }),
    })],
})
export class DbModule {
}
