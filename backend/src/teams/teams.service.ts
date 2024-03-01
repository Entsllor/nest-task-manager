import {Injectable} from "@nestjs/common";
import {CreateTeamDto, UpdateTeamDto} from "./teams.schemas";
import {TeamsRepository} from "./teams.repository";
import {UUID} from "backend-batteries";
import {FindOptionsWhere} from "typeorm";
import {Team} from "./teams.entity";
import {TeamMembersService} from "./team-members/team-members.service";

@Injectable()
export class TeamsService {
    constructor(private repo: TeamsRepository, private teamMembersService: TeamMembersService) {
    }

    async create(createTeamDto: CreateTeamDto, authorId: UUID) {
        const team = await this.repo.create({...createTeamDto, authorId});
        await this.teamMembersService.create(team.id, authorId);
        return team;
    }

    async findAll(criteria?: FindOptionsWhere<Team>) {
        return this.repo.findMany(criteria);
    }

    async findOne(criteria?: FindOptionsWhere<Team>) {
        return this.repo.findOne(criteria);
    }

    async update(id: number, updateTeamDto: UpdateTeamDto) {
        return this.repo.updateOne({id}, updateTeamDto);
    }

    async remove(id: number) {
        return this.repo.delete({id});
    }

    async hasAccess(teamId: number, userId: UUID): Promise<boolean> {
        return this.teamMembersService.isMember(teamId, userId);
    }
}
