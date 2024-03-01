import {Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import {BoardsService} from "./boards.service";
import {BoardDto, CreateBoardDto, UpdateBoardDto} from "./boards.schemas";
import {OpenApiSettings} from "helpers/decorators/open-api-settings";
import {ParseResponse} from "helpers/decorators/parse-response";
import {UserId} from "auth/decorators/user-id.decorator";
import {UUID} from "backend-batteries";
import {ApiResponse} from "@nestjs/swagger";

@OpenApiSettings("boards")
@Controller("boards")
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {
    }

    @Post()
    @ParseResponse({type: BoardDto})
    async create(@Body() createBoardDto: CreateBoardDto, @UserId() userId: UUID) {
        return this.boardsService.create(createBoardDto, userId);
    }

    @Get()
    @ParseResponse({type: BoardDto, isArray: true})
    async findAll(@UserId() userId: UUID) {
        return this.boardsService.findAll({}, userId);
    }

    @Get(":id")
    @ParseResponse({type: BoardDto})
    async findOne(@Param("id", ParseIntPipe) id: number, @UserId() userId: UUID) {
        return this.boardsService.findOne(+id, userId);
    }

    @Put(":id")
    @ApiResponse({status: 204})
    async update(@Param("id", ParseIntPipe) id: number, @Body() updateBoardDto: UpdateBoardDto, @UserId() userId: UUID) {
        return this.boardsService.update(+id, updateBoardDto, userId);
    }

    @Delete(":id")
    @HttpCode(204)
    async remove(@Param("id", ParseIntPipe) id: number, @UserId() userId: UUID) {
        await this.boardsService.remove(+id, userId);
    }
}
