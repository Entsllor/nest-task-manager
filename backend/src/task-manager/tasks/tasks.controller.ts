import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put} from "@nestjs/common";
import {raise, UUID} from "backend-batteries";
import {TasksService} from "./tasks.service";
import {CreateTaskDto, TaskDto, UpdateTaskDto} from "./tasks.schemas";
import {TaskNotFound} from "../task-manager.exceptions";
import {ParseResponse} from "../../helpers/decorators/parse-response";
import {EmptyResponse} from "../../helpers/decorators/empty-response";
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
        return this.tasksService.getMany({authorId: userId});
    }

    @Get(":id")
    @ParseResponse({type: TaskDto})
    async getOne(@Param("id", ParseUUIDPipe) id: UUID) {
        return await this.tasksService.getOne(id) || raise(TaskNotFound);
    }

    @Put(":id")
    @ParseResponse({type: TaskDto})
    async update(@Param("id", ParseUUIDPipe) id: UUID, @Body() body: UpdateTaskDto) {
        return await this.tasksService.update(id, body) || raise(TaskNotFound);
    }

    @Delete(":id")
    @EmptyResponse()
    async delete(@Param("id", ParseUUIDPipe) id: UUID) {
        return {ok: !!await this.tasksService.delete(id) || raise(TaskNotFound)};
    }
}
