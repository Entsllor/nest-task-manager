import {Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put} from "@nestjs/common";
import {raise, UUID} from "backend-batteries";
import {TasksService} from "./tasks.service";
import {CreateTaskDto, TaskDto, UpdateTaskDto} from "./tasks.schemas";
import {TaskNotFound} from "../task-manager.exceptions";
import {ParseResponse} from "../../helpers/decorators/parse-response";
import {OpenApiSettings} from "../../helpers/decorators/open-api-settings";
import {UserId} from "../../auth/decorators/user-id.decorator";

@OpenApiSettings("tasks")
@Controller("tasks")
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @Post()
    @ParseResponse({type: TaskDto})
    create(@Body() body: CreateTaskDto, @UserId() userId: UUID) {
        return this.tasksService.create(body, userId);
    }

    @Get()
    @ParseResponse({type: TaskDto, isArray: true})
    getMany(@UserId() userId: UUID) {
        return this.tasksService.getMany(userId, {});
    }

    @Get(":id")
    @ParseResponse({type: TaskDto})
    async getOne(@Param("id", ParseUUIDPipe) id: UUID, @UserId() userId: UUID) {
        return await this.tasksService.getOne(id, userId) || raise(TaskNotFound);
    }

    @Put(":id")
    @ParseResponse({type: TaskDto})
    async update(@Param("id", ParseUUIDPipe) id: UUID, @Body() body: UpdateTaskDto, @UserId() userId: UUID) {
        return await this.tasksService.update(id, body, userId) || raise(TaskNotFound);
    }

    @Delete(":id")
    @HttpCode(204)
    async delete(@Param("id", ParseUUIDPipe) id: UUID, @UserId() userId: UUID) {
        await this.tasksService.delete(id, userId) || raise(TaskNotFound);
    }
}
