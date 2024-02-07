import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query} from "@nestjs/common";
import {raise, UUID} from "backend-batteries";
import {TasksService} from "./tasks.service";
import {CreateTaskDto, TaskDto, TaskSearchDto, UpdateTaskDto} from "./tasks.schemas";
import {TaskNotFound} from "../task-manager.exceptions";
import {ParseResponse} from "../../helpers/decorators/parse-response";
import {EmptyResponse} from "../../helpers/decorators/empty-response";

@Controller("tasks")
export class TasksController {
    constructor(private tasksService: TasksService) {
        this.tasksService = tasksService;
    }

    @Post()
    @ParseResponse({type: TaskDto})
    create(@Body() body: CreateTaskDto) {
        return this.tasksService.create(body);
    }

    @Get()
    @ParseResponse({type: TaskDto, isArray: true})
    getMany(@Query() query?: TaskSearchDto) {
        return this.tasksService.getMany(query);
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
