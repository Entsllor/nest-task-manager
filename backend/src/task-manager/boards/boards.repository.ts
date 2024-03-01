import {Board} from "./boards.entity";
import {DataSource, EntityTarget} from "typeorm";
import {ClsService} from "nestjs-cls";
import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";
import {UUID} from "backend-batteries";
import {TeamMember} from "../../teams/team-members/team-members.entity";

@Injectable()
export class BoardsRepository extends BaseRepository<Board> {
    model: EntityTarget<Board> = Board;

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }

    getByPk(id: Board["id"]): Promise<Board | null> {
        return this.repo.findOneBy({id});
    }

    async getAvailable(userId: UUID): Promise<Board[]> {
        return (
            this.repo.createQueryBuilder('board')
                .leftJoin(TeamMember, 'tm', 'tm.teamId = board.teamId and tm.userId = :userId', {userId})
                .where('tm is not null or board.authorId = :userId')
                .getMany()
        );
    }
}
