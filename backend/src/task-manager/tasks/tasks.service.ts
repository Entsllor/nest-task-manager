import {Injectable} from "@nestjs/common";
import {UUID} from "backend-batteries";
import {CreateTaskDto, UpdateTaskDto} from "./tasks.schemas";
import {Task} from "./tasks.model";
import {TasksRepository} from "./tasks.repository";

@Injectable()
export class TasksService {
    constructor(private repo: TasksRepository) {
    }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.repo.create(createTaskDto);
    }

    getOne(taskId: UUID) {
        return this.repo.first({id: taskId});
    }

    getMany(criteria?: Partial<Task>): Promise<Task[]> {
        return this.repo.findMany(criteria);
    }

    async update(taskId: UUID, data: UpdateTaskDto): Promise<Task | undefined> {
        return this.repo.updateOne({id: taskId}, data);
    }

    async delete(taskId: UUID): Promise<number> {
        return this.repo.delete({id: taskId});
    }
}
