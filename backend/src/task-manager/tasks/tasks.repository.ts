import {Task} from "./tasks.entity";
import {DataSource, EntityTarget} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
    model: EntityTarget<Task> = Task;

    getByPk(id: string): Promise<Task | null> {
        return this.repo.findOneBy({id});
    }

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }
}