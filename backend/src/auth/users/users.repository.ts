import {Injectable} from "@nestjs/common";
import {BaseRepository} from "helpers/db/base-repository";
import {User} from "./users.entity";
import {DataSource} from "typeorm";
import {ClsService} from "nestjs-cls";
import {UUID} from "backend-batteries";

@Injectable()
export class UsersRepository extends BaseRepository<User> {
    model = User;

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }

    getByEmailOrUsername(email: string, username: string): Promise<User | null> {
        return this.repo.findOne({where: [{username}, {email}]});
    }

    getByPk(id: UUID) {
        return this.repo.findOneBy({id});
    }
}
