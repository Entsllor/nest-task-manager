import {Injectable} from "@nestjs/common";
import {UUID, uuid4, valuesOf} from "backend-batteries";
import {CreateTaskDto, TaskDto, UpdateTaskDto} from "./tasks.schemas";

@Injectable()
export class TasksService {
    private db: Record<UUID, TaskDto> = {};

    create(createTaskDto: CreateTaskDto): Promise<TaskDto> {
        const task: TaskDto = {...createTaskDto, id: uuid4()};
        this.db[task.id] = task;
        return Promise.resolve(task);
    }

    getOne(taskId: UUID): Promise<TaskDto | undefined> {
        return Promise.resolve(this.db[taskId]);
    }

    getMany(): Promise<TaskDto[]> {
        return Promise.resolve(valuesOf(this.db));
    }

    update(taskId: UUID, data: UpdateTaskDto): Promise<TaskDto | undefined> {
        let task = this.db[taskId];
        if (!task) {
            return Promise.resolve(undefined);
        }
        task = {...task, ...data};
        delete this.db[taskId];
        return Promise.resolve(task);
    }

    delete(taskId: UUID): Promise<boolean> {
        if (!this.db[taskId]) {
            return Promise.resolve(false);
        }
        delete this.db[taskId];
        return Promise.resolve(true);
    }
}
