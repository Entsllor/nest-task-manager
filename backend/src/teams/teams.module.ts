import {Module} from "@nestjs/common";
import {TeamsService} from "./teams.service";
import {TeamsController} from "./teams.controller";
import {TeamMembersModule} from "./team-members/team-members.module";
import {TeamsRepository} from "./teams.repository";

@Module({
    imports: [TeamMembersModule],
    controllers: [TeamsController],
    providers: [TeamsRepository, TeamsService],
    exports: [TeamsRepository, TeamsService, TeamMembersModule],
})
export class TeamsModule {
}
