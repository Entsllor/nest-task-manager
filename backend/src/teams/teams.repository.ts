import {Team} from "./teams.entity";
import {DataSource, EntityTarget} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";

@Injectable()
export class TeamsRepository extends BaseRepository<Team> {
    model: EntityTarget<Team> = Team;

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }

    async getByPk(id: Team["id"]): Promise<Team | null> {
        return this.repo.findOneBy({id});
    }
}
