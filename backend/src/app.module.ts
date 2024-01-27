import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {CommonModule} from "./common/common.module";
import { TaskManagerModule } from './task-manager/task-manager.module';

@Module({
    imports: [CommonModule, TaskManagerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
