import {Injectable} from "@nestjs/common";
import {BaseRepository} from "../../helpers/db/base-repository";
import {RefreshToken} from "./refresh-tokens.model";
import {DataSource} from "typeorm";
import {ClsService} from "nestjs-cls";

@Injectable()
export class RefreshTokensRepository extends BaseRepository<RefreshToken> {
    model = RefreshToken;
    idFieldName = 'body'

    constructor(dataSource: DataSource, cls: ClsService) {
        super(dataSource, cls);
    }

    getByPk(body: string): Promise<RefreshToken | null> {
        return this.repo.findOneBy({body});
    }
}
