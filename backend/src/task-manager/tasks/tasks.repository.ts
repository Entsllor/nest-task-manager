import {Task} from "./tasks.entity";
import {DataSource, EntityTarget, FindOptionsWhere, In} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";
import {UUID} from "backend-batteries";
import {BoardsRepository} from "../boards/boards.repository";

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
    model: EntityTarget<Task> = Task;

    getByPk(id: string): Promise<Task | null> {
        return this.repo.findOneBy({id});
    }

    constructor(dataSource: DataSource, cls: ClsService, private boardsRepository: BoardsRepository) {
        super(dataSource, cls);
    }

    async getAvailable(userId: UUID, criteria: FindOptionsWhere<Task>) {
        const boards = await this.boardsRepository.getAvailable(userId);
        if (!boards.length) {
            return [];
        }
        return this.repo.findBy({boardId: In(boards.map(i => i.id)), ...criteria});
    }
}