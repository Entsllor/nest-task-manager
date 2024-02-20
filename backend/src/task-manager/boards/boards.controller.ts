import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
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
    create(@Body() createBoardDto: CreateBoardDto, @UserId() userId: UUID) {
        return this.boardsService.create(createBoardDto, userId);
    }

    @Get()
    @ParseResponse({type: BoardDto, isArray: true})
    findAll() {
        return this.boardsService.findAll();
    }

    @Get(":id")
    @ParseResponse({type: BoardDto})
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.boardsService.findOne({id: +id});
    }

    @Put(":id")
    @ApiResponse({status: 204})
    update(@Param("id", ParseIntPipe) id: number, @Body() updateBoardDto: UpdateBoardDto) {
        return this.boardsService.update(+id, updateBoardDto);
    }

    @Delete(":id")
    @ApiResponse({status: 204})
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.boardsService.remove(+id);
    }
}
