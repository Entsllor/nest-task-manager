import {Injectable} from "@nestjs/common";
import {CreateTeamDto, UpdateTeamDto} from "./teams.schemas";
import {TeamsRepository} from "./teams.repository";
import {Forbidden, raise, UUID} from "backend-batteries";
import {FindOptionsWhere} from "typeorm";
import {Team} from "./teams.entity";
import {TeamMembersService} from "./team-members/team-members.service";
import {TeamNotFound} from "./teams.exceptions";
import {IdsOr} from "../helpers/types/entity-types";

@Injectable()
export class TeamsService {
    constructor(private teamMembersService: TeamMembersService, private repo: TeamsRepository) {
    }

    async create(createTeamDto: CreateTeamDto, authorId: UUID) {
        const team = await this.repo.create({...createTeamDto, authorId});
        await this.teamMembersService.create({teamId: team.id, userId: authorId}, authorId);
        return team;
    }

    async findAll(_criteria: FindOptionsWhere<Team>, userId: UUID) {
        return this.repo.getAvailable(userId);
    }

    async findOne(id: number, userId: UUID) {
        await this.checkAccess({id}, userId);
        return this.repo.getByPk(id);
    }

    async update(id: number, updateTeamDto: UpdateTeamDto, userId: UUID) {
        await this.checkAccess({id}, userId);
        return this.repo.updateOne({id}, updateTeamDto);
    }

    async remove(id: number, userId: UUID) {
        await this.checkAccess({id}, userId);
        return this.repo.delete({id});
    }

    async hasAccess(teamOrIds: IdsOr<Team>, userId: UUID): Promise<boolean> {
        const team = await this.repo.get(teamOrIds) || raise(TeamNotFound);
        return team.authorId === userId || this.teamMembersService.isMember(team.id, userId);
    }

    async checkAccess(...args: Parameters<typeof this.hasAccess>): Promise<void> {
        await this.hasAccess(...args) || raise(Forbidden);
    }
}
