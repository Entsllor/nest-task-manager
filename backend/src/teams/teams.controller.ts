import {Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import {TeamsService} from "./teams.service";
import {CreateTeamDto, TeamDto, UpdateTeamDto} from "./teams.schemas";
import {OpenApiSettings} from "../helpers/decorators/open-api-settings";
import {ParseResponse} from "../helpers/decorators/parse-response";
import {UserId} from "../auth/decorators/user-id.decorator";
import {UUID} from "backend-batteries";

@OpenApiSettings("teams")
@Controller("teams")
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {
    }

    @Post()
    @ParseResponse({type: TeamDto})
    async create(@Body() createTeamDto: CreateTeamDto, @UserId() userId: UUID) {
        return this.teamsService.create(createTeamDto, userId);
    }

    @Get()
    @ParseResponse({type: TeamDto, isArray: true})
    async findAll(@UserId() userId: UUID) {
        return this.teamsService.findAll({}, userId);
    }

    @Get(":id")
    @ParseResponse({type: TeamDto})
    async findOne(@Param("id", ParseIntPipe) id: number, @UserId() userId: UUID) {
        return this.teamsService.findOne(+id, userId);
    }

    @Put(":id")
    @ParseResponse({type: TeamDto})
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateTeamDto: UpdateTeamDto, @UserId() userId: UUID) {
        return this.teamsService.update(+id, updateTeamDto, userId);
    }

    @Delete(":id")
    @HttpCode(204)
    async remove(@Param("id", ParseIntPipe) id: number, @UserId() userId: UUID) {
        await this.teamsService.remove(+id, userId);
    }
}
