import {Module} from "@nestjs/common";
import {Settings} from "../settings/settings.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SettingsModule} from "../settings/settings.module";
import {getDbSettings} from "./db.settings";
import {join} from "path";
import {BASE_PATH} from "../../helpers/paths";
import {TransactionsInterceptor} from "./db.transactions.interceptor";
import {ClsModule} from "nestjs-cls";


@Module({
    providers: [TransactionsInterceptor],
    exports: [TransactionsInterceptor],
    imports: [SettingsModule, ClsModule, TypeOrmModule.forRootAsync({
        imports: [SettingsModule],
        inject: [Settings],
        useFactory: (settings: Settings) => ({
            ...getDbSettings(settings.vars),
            migrations: [join(BASE_PATH, "migrations", "*.{ts,js}")],
        }),
    })],
})
export class DbModule {
}
