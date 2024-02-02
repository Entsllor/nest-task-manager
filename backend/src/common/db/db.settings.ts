import {AppMode, ISettings} from "../settings/settings.types";
import {DataSourceOptions} from "typeorm";

export function getDbSettings(envVars: ISettings): DataSourceOptions {
    return {
        type: envVars.DB_TYPE as any,
        host: envVars.DB_HOST,
        port: envVars.DB_PORT,
        username: envVars.DB_USER,
        password: envVars.DB_PASSWORD,
        database: envVars.DB_NAME,
        logging: false,
        entities: ["src/**/*.model.{js,ts}"],
        migrations: ["migrations/*.{js,ts}"],
        subscribers: [],
        useUTC: true,
        synchronize: envVars.NODE_ENV === AppMode.test,
        dropSchema: envVars.NODE_ENV === AppMode.test,
    };
}
