import {BaseRepository} from "../../helpers/db/base-repository";
import {Task} from "./tasks.model";
import {DataSource, EntityTarget} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";

@Injectable()
export class TasksRepository extends BaseRepository<Task> {
    model: EntityTarget<Task> = Task;

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }
}