import {TeamMember} from "./team-members.entity";
import {DataSource, EntityTarget} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";
import {UUID} from "backend-batteries";

@Injectable()
export class TeamMembersRepository extends BaseRepository<TeamMember> {
    model: EntityTarget<TeamMember> = TeamMember;

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }

    getByPk(userId: UUID, teamId: number): Promise<TeamMember | null> {
        return this.repo.findOneBy({userId, teamId});
    }
}
