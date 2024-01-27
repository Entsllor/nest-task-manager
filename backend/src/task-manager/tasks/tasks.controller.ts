import {Body, Controller, Get, Param, ParseUUIDPipe, Post, Put} from "@nestjs/common";
import {raise, UUID} from "backend-batteries";
import {TasksService} from "./tasks.service";
import {CreateTaskDto, UpdateTaskDto} from "./tasks.schemas";
import {TaskNotFound} from "../task-manager.exceptions";

@Controller("tasks")
export class TasksController {
    constructor(private tasksService: TasksService) {
        this.tasksService = tasksService;
    }

    @Post()
    create(@Body() body: CreateTaskDto) {
        return this.tasksService.create(body);
    }

    @Get()
    getMany() {
        return this.tasksService.getMany();
    }

    @Get(":id")
    async getOne(@Param("id", ParseUUIDPipe) id: UUID) {
        return await this.tasksService.getOne(id) || raise(TaskNotFound);
    }

    @Put("id")
    async update(@Param("id", ParseUUIDPipe) id: UUID, @Body() body: UpdateTaskDto) {
        return await this.tasksService.update(id, body) || raise(TaskNotFound);
    }

    @Put("id")
    async delete(@Param("id", ParseUUIDPipe) id: UUID) {
        return {ok: await this.tasksService.delete(id) || raise(TaskNotFound)};
    }
}
