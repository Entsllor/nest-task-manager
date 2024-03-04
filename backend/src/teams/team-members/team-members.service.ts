import {Injectable, OnModuleInit} from "@nestjs/common";
import {UUID} from "backend-batteries";
import {TeamMember} from "./team-members.entity";
import {CreateTeamMemberDto, IdentityTeamMemberDto} from "./team-members.schemas";
import {TeamMembersRepository} from "./team-members.repository";
import {TeamsService} from "../teams.service";
import {ModuleRef} from "@nestjs/core";

@Injectable()
export class TeamMembersService implements OnModuleInit {
    private teamsService: TeamsService;

    constructor(
        private repo: TeamMembersRepository,
        private moduleRef: ModuleRef
    ) {
    }

    async onModuleInit() {
        this.teamsService = await this.moduleRef.create(TeamsService)
    }

    async isMember(teamId: number, userId: UUID): Promise<boolean> {
        return this.repo.findOne({teamId, userId}).then(i => !!i);
    }

    async create(dto: CreateTeamMemberDto, authorId: UUID): Promise<TeamMember> {
        await this.teamsService.checkAccess({id: dto.teamId}, authorId);
        const duplicate = await this.repo.get({userId: dto.userId, teamId: dto.teamId});
        return duplicate || await this.repo.create(dto);
    }

    async delete(dto: IdentityTeamMemberDto, authorId: UUID) {
        await this.teamsService.checkAccess({id: dto.teamId}, authorId);
        return this.repo.delete(dto).then(Boolean);
    }
}
