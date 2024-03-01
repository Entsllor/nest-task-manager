import {Module} from "@nestjs/common";
import {TeamMembersService} from "./team-members.service";
import {TeamMembersController} from "./team-members.controller";
import {TeamMembersRepository} from "./team-members.repository";

@Module({
    controllers: [TeamMembersController],
    providers: [TeamMembersService, TeamMembersRepository],
    exports: [TeamMembersService, TeamMembersRepository],
})
export class TeamMembersModule {
}
