import {Module} from "@nestjs/common";
import {Settings} from "../settings/settings.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppMode} from "../settings/settings.types";
import {SettingsModule} from "../settings/settings.module";

@Module({
    imports: [SettingsModule, TypeOrmModule.forRootAsync({
        imports: [SettingsModule],
        inject: [Settings],
        useFactory: (settings: Settings) => ({
            type: settings.vars.DB_TYPE as any,
            host: settings.vars.DB_HOST,
            port: settings.vars.DB_PORT,
            username: settings.vars.DB_USER,
            password: settings.vars.DB_PASSWORD,
            database: settings.vars.DB_NAME,
            logging: settings.vars.DB_LOGGING,
            entities: ["src/**/*.model.ts"],
            migrations: ["src/migrations/*.ts"],
            subscribers: [],
            useUTC: true,
            synchronize: settings.vars.NODE_ENV === AppMode.test,
            dropSchema: settings.vars.NODE_ENV === AppMode.test,
        }),
    })],
})
export class DbModule {
}
