import {Injectable} from "@nestjs/common";
import {UUID} from "backend-batteries";
import {FindOptionsWhere} from "typeorm";
import {Board} from "./boards.entity";
import {BoardsRepository} from "./boards.repository";
import {CreateBoardDto, UpdateBoardDto} from "./boards.schemas";

@Injectable()
export class BoardsService {
    constructor(private repo: BoardsRepository) {
    }

    create(createBoardDto: CreateBoardDto, authorId: UUID) {
        return this.repo.create({...createBoardDto, authorId});
    }

    findAll(criteria?: FindOptionsWhere<Board>) {
        return this.repo.findMany(criteria);
    }

    findOne(criteria?: FindOptionsWhere<Board>) {
        return this.repo.first(criteria);
    }

    update(id: number, updateBoardDto: UpdateBoardDto) {
        return this.repo.updateOne({id}, updateBoardDto);
    }

    remove(id: number) {
        return this.repo.delete({id});
    }
}
