import {Board} from "./boards.entity";
import {DataSource, EntityTarget} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";

@Injectable()
export class BoardsRepository extends BaseRepository<Board> {
    model: EntityTarget<Board> = Board;

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }

    getByPk(id: Board["id"]): Promise<Board | null> {
        return this.repo.findOneBy({id});
    }
}
