import {Injectable} from "@nestjs/common";
import {UUID} from "backend-batteries";
import {CreateTaskDto, UpdateTaskDto} from "./tasks.schemas";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./tasks.model";
import {Repository} from "typeorm";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {
    }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.taskRepo.create(createTaskDto);
        return this.taskRepo.save(task);
    }

    getOne(taskId: UUID): Promise<Task | null> {
        return this.taskRepo.findOneBy({id: taskId});
    }

    getMany(): Promise<Task[]> {
        return this.taskRepo.findBy({});
    }

    async update(taskId: UUID, data: UpdateTaskDto): Promise<Task | undefined> {
        const task = await this.taskRepo.findOneBy({id: taskId});
        if (!task)
            return undefined;
        return this.taskRepo.save({id: taskId, ...data});
    }

    async delete(taskId: UUID): Promise<boolean> {
        return this.taskRepo.delete({id: taskId}).then(value => (value.affected ?? 0) > 0);
    }
}
