import {Module} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {TasksController} from "./tasks.controller";
import {TasksRepository} from "./tasks.repository";
import {TeamsModule} from "../../teams/teams.module";
import {BoardsModule} from "../boards/boards.module";

@Module({
    imports: [TeamsModule, BoardsModule],
    providers: [TasksService, TasksRepository],
    controllers: [TasksController],
    exports: [TasksService],
})
export class TasksModule {
}
