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
    create(@Body() createTeamDto: CreateTeamDto, @UserId() userId: UUID) {
        return this.teamsService.create(createTeamDto, userId);
    }

    @Get()
    @ParseResponse({type: TeamDto, isArray: true})
    findAll() {
        return this.teamsService.findAll();
    }

    @Get(":id")
    @ParseResponse({type: TeamDto})
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.findOne({id: +id});
    }

    @Put(":id")
    @HttpCode(204)
    update(@Param("id", ParseIntPipe) id: number, @Body() updateTeamDto: UpdateTeamDto) {
        return this.teamsService.update(+id, updateTeamDto);
    }

    @Delete(":id")
    @HttpCode(204)
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.teamsService.remove(+id);
    }
}
