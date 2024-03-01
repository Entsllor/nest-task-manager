import {Module} from "@nestjs/common";
import {BoardsService} from "./boards.service";
import {BoardsController} from "./boards.controller";
import {BoardsRepository} from "./boards.repository";
import {TeamsModule} from "../../teams/teams.module";

@Module({
    imports: [TeamsModule],
    controllers: [BoardsController],
    providers: [BoardsRepository, BoardsService],
    exports: [BoardsService, BoardsRepository],
})
export class BoardsModule {
}
