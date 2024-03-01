import {Injectable} from "@nestjs/common";
import {UUID} from "backend-batteries";
import {TeamMembersRepository} from "./team-members.repository";
import {TeamMember} from "./team-members.entity";

@Injectable()
export class TeamMembersService {
    constructor(private repo: TeamMembersRepository) {
    }

    async isMember(teamId: number, userId: UUID): Promise<boolean> {
        return this.repo.findOne({teamId, userId}).then(i => !!i);
    }

    async create(teamId: number, userId: UUID): Promise<TeamMember> {
        return this.repo.create({teamId, userId})
    }
}
