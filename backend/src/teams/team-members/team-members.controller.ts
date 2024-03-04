import {Body, Controller, Delete, HttpCode, Post} from "@nestjs/common";
import {UserId} from "../../auth/decorators/user-id.decorator";
import {UUID} from "backend-batteries";
import {OpenApiSettings} from "../../helpers/decorators/open-api-settings";
import {ParseResponse} from "../../helpers/decorators/parse-response";
import {CreateTeamMemberDto, IdentityTeamMemberDto, TeamMemberDto} from "./team-members.schemas";
import {TeamMembersService} from "./team-members.service";

@Controller("team-members")
@OpenApiSettings("team-members")
export class TeamMembersController {
    constructor(private service: TeamMembersService) {
    }

    @Post()
    @ParseResponse({type: TeamMemberDto})
    async create(@Body() body: CreateTeamMemberDto, @UserId() userId: UUID) {
        return this.service.create(body, userId);
    }

    @Delete()
    @HttpCode(204)
    async delete(@Body() body: IdentityTeamMemberDto, @UserId() userId: UUID) {
        return this.service.delete(body, userId);
    }
}
