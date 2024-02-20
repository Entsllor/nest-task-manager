import {Module} from "@nestjs/common";
import {TeamsService} from "./teams.service";
import {TeamsController} from "./teams.controller";
import {TeamMembersModule} from "./team-members/team-members.module";
import {TeamsRepository} from "./teams.repository";

@Module({
    controllers: [TeamsController],
    providers: [TeamsService, TeamsRepository],
    imports: [TeamMembersModule],
})
export class TeamsModule {
}
