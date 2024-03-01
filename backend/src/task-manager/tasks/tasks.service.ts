import {Injectable} from "@nestjs/common";
import {Forbidden, raise, UUID} from "backend-batteries";
import {CreateTaskDto, UpdateTaskDto} from "./tasks.schemas";
import {Task} from "./tasks.entity";
import {TasksRepository} from "./tasks.repository";
import {BoardsService} from "../boards/boards.service";
import {TaskNotFound} from "../task-manager.exceptions";
import {ForeignId, IdsOr} from "../../helpers/types/entity-types";
import {Board} from "../boards/boards.entity";

@Injectable()
export class TasksService {
    constructor(private repo: TasksRepository, private boardsService: BoardsService) {
    }

    async hasAccess(taskOrIds: IdsOr<Task>, userId: UUID, options?: {
        newBoardId?: ForeignId<Board>,
        undefinedIfNotFound?: boolean
    }): Promise<boolean | undefined> {
        const task = await this.repo.get(taskOrIds);
        if (!task) {
            if (options?.undefinedIfNotFound) {
                return;
            }
            raise(TaskNotFound);
        }
        if ((task.authorId === userId)) {
            return true;
        }
        const boardId = options?.newBoardId ?? task.boardId;
        return this.boardsService.hasAccess({id: boardId}, userId);
    }

    async checkAccess(...args: Parameters<typeof this.hasAccess>) {
        await this.hasAccess(...args) || raise(Forbidden);
    }

    async create(createTaskDto: CreateTaskDto, userId: UUID): Promise<Task> {
        let boardId = createTaskDto.boardId;
        if (!boardId) {
            const board = await this.boardsService.create({name: "My tasks"}, userId);
            boardId = board.id;
        } else {
            await this.boardsService.hasAccess({id: boardId}, userId) || raise(Forbidden);
        }
        return this.repo.create({...createTaskDto, boardId: boardId, authorId: userId});
    }

    async getOne(taskId: UUID, userId: UUID) {
        const task = await this.repo.findOne({id: taskId}) || raise(TaskNotFound);
        await this.checkAccess(task, userId);
        return task;
    }

    async getMany(userId: UUID, criteria: Partial<Task>): Promise<Task[]> {
        return this.repo.getAvailable(userId, criteria);
    }

    async update(taskId: UUID, data: UpdateTaskDto, userId: UUID): Promise<Task | undefined> {
        await this.checkAccess({id: taskId}, userId, {newBoardId: data.boardId});
        return this.repo.updateOne({id: taskId}, data);
    }

    async delete(taskId: UUID, userId: UUID): Promise<boolean> {
        await this.checkAccess({id: taskId}, userId);
        return this.repo.delete({id: taskId}).then(Boolean);
    }
}
