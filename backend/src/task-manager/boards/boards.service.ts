import {Injectable} from "@nestjs/common";
import {Forbidden, raise, UUID} from "backend-batteries";
import {FindOptionsWhere} from "typeorm";
import {Board} from "./boards.entity";
import {BoardsRepository} from "./boards.repository";
import {CreateBoardDto, UpdateBoardDto} from "./boards.schemas";
import {TeamsService} from "../../teams/teams.service";
import {IdsOr} from "../../helpers/types/entity-types";
import {BoardNotFound} from "../task-manager.exceptions";

@Injectable()
export class BoardsService {
    constructor(private repo: BoardsRepository, private teamsService: TeamsService) {
    }

    async create(createBoardDto: CreateBoardDto, authorId: UUID) {
        if (createBoardDto.teamId) {
            await this.teamsService.hasAccess(createBoardDto.teamId, authorId);
        }
        return this.repo.create({...createBoardDto, authorId});
    }

    async findAll(_criteria: FindOptionsWhere<Board>, userId: UUID) {
        return this.repo.getAvailable(userId);
    }

    async findOne(id: number, userId: UUID) {
        await this.checkAccess({id}, userId);
        return this.repo.findOne({id});
    }

    async update(id: number, updateBoardDto: UpdateBoardDto, userId: UUID) {
        await this.checkAccess({id}, userId);
        return this.repo.updateOne({id}, updateBoardDto);
    }

    async remove(id: number, userId: UUID) {
        await this.checkAccess({id}, userId);
        return this.repo.delete({id});
    }

    async hasAccess(boardOrIds: IdsOr<Board>, userId: UUID): Promise<boolean> {
        const board = await this.repo.get(boardOrIds);
        if (!board) {
            raise(BoardNotFound);
        }
        if (board.authorId === userId) {
            return true;
        }
        if (board.teamId) {
            return await this.teamsService.hasAccess(board.teamId, userId);
        }
        return false;
    }

    async checkAccess(...args: Parameters<typeof this.hasAccess>): Promise<void> {
        await this.hasAccess(...args) || raise(Forbidden);
    }
}
