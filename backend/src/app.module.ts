import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {CommonModule} from "./common/common.module";
import {TaskManagerModule} from "./task-manager/task-manager.module";
import {APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import {TransactionsInterceptor} from "./common/db/db.transactions.interceptor";
import {UsersModule} from "./auth/users/users.module";
import {AuthModule} from "./auth/auth.module";
import {JwtAuthGuard} from "./auth/jwt/jwt-auth.guard";
import {TeamsModule} from "./teams/teams.module";

@Module({
    imports: [CommonModule, TaskManagerModule, UsersModule, AuthModule, TeamsModule],
    controllers: [AppController],
    providers: [
        AppService,
        {provide: APP_INTERCEPTOR, useClass: TransactionsInterceptor},
        {provide: APP_GUARD, useClass: JwtAuthGuard},
    ],
})
export class AppModule {
}
