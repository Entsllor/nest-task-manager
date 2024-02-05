import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {CommonModule} from "./common/common.module";
import {TaskManagerModule} from "./task-manager/task-manager.module";
import {APP_INTERCEPTOR, APP_PIPE} from "@nestjs/core";
import {ZodValidationPipe} from "nestjs-zod";
import {TransactionsInterceptor} from "./common/db/db.transactions.interceptor";
import { UsersModule } from './auth/users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [CommonModule, TaskManagerModule, UsersModule, AuthModule],
    controllers: [AppController],
    providers: [AppService, {provide: APP_PIPE, useClass: ZodValidationPipe}, {
        provide: APP_INTERCEPTOR,
        useClass: TransactionsInterceptor,
    }],
})
export class AppModule {
}
