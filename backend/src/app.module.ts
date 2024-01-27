import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {CommonModule} from "./common/common.module";
import {TaskManagerModule} from "./task-manager/task-manager.module";
import {APP_PIPE} from "@nestjs/core";
import {ZodValidationPipe} from "nestjs-zod";

@Module({
    imports: [CommonModule, TaskManagerModule],
    controllers: [AppController],
    providers: [AppService, {provide: APP_PIPE, useClass: ZodValidationPipe}],
})
export class AppModule {
}
