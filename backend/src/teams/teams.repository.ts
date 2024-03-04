import {Team} from "./teams.entity";
import {DataSource, EntityTarget} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";
import {TeamMember} from "./team-members/team-members.entity";
import {UUID} from "backend-batteries";

@Injectable()
export class TeamsRepository extends BaseRepository<Team> {
    model: EntityTarget<Team> = Team;

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }

    async getByPk(id: Team["id"]): Promise<Team | null> {
        return this.repo.findOneBy({id});
    }


    async getAvailable(userId: UUID): Promise<Team[]> {
        return (
            this.repo.createQueryBuilder("team")
                .leftJoin(
                    TeamMember,
                    "tm",
                    "tm.userId = :userId AND tm.teamId = team.id", {userId})
                .where("team.authorId = :userId OR tm is not null")
                .getMany()
        );
    }
}
