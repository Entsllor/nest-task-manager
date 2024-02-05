import {Module} from "@nestjs/common";
import {Settings} from "../settings/settings.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SettingsModule} from "../settings/settings.module";
import {getDbSettings} from "./db.settings";
import {join} from "path";
import {BASE_PATH} from "../../helpers/paths";
import {TransactionsInterceptor} from "./db.transactions.interceptor";
import {ClsModule} from "nestjs-cls";
import {Task} from "../../task-manager/tasks/tasks.model";
import {User} from "../../auth/users/users.model";


@Module({
    providers: [TransactionsInterceptor],
    exports: [TransactionsInterceptor],
    imports: [SettingsModule, ClsModule, TypeOrmModule.forRootAsync({
        imports: [SettingsModule],
        inject: [Settings],
        useFactory: (settings: Settings) => ({
            ...getDbSettings(settings.vars),
            migrations: [join(BASE_PATH, "migrations", "*.{ts,js}")],
            entities: [Task, User],
        }),
    })],
})
export class DbModule {
}
