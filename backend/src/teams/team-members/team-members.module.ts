import {forwardRef, Module} from "@nestjs/common";
import {TeamMembersService} from "./team-members.service";
import {TeamMembersController} from "./team-members.controller";
import {TeamMembersRepository} from "./team-members.repository";
import {TeamsService} from "../teams.service";
import {TeamsModule} from "../teams.module";

@Module({
    imports: [forwardRef(() => TeamsModule)],
    controllers: [TeamMembersController],
    providers: [TeamMembersService, TeamMembersRepository, TeamsService],
    exports: [TeamMembersService, TeamMembersRepository],
})
export class TeamMembersModule {
}
