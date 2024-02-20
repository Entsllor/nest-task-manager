import {Injectable} from "@nestjs/common";
import {CreateTeamDto, UpdateTeamDto} from "./teams.schemas";
import {TeamsRepository} from "./teams.repository";
import {UUID} from "backend-batteries";
import {FindOptionsWhere} from "typeorm";
import {Team} from "./teams.entity";

@Injectable()
export class TeamsService {
    constructor(private repo: TeamsRepository) {
    }

    create(createTeamDto: CreateTeamDto, authorId: UUID) {
        return this.repo.create({...createTeamDto, authorId});
    }

    findAll(criteria?: FindOptionsWhere<Team>) {
        return this.repo.findMany(criteria);
    }

    findOne(criteria?: FindOptionsWhere<Team>) {
        return this.repo.first(criteria);
    }

    update(id: number, updateTeamDto: UpdateTeamDto) {
        return this.repo.updateOne({id}, updateTeamDto);
    }

    remove(id: number) {
        return this.repo.delete({id});
    }
}
