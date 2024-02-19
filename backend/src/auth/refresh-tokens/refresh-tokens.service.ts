import {Injectable} from "@nestjs/common";
import {RefreshTokensRepository} from "./refresh-tokens.repository";
import {CreateRefreshTokenDto} from "./refresh-tokens.schemas";
import {raise, uuid4} from "backend-batteries";
import {Settings} from "../../common/settings/settings.service";
import {addMinutes} from "date-fns";
import {RefreshToken} from "./refresh-tokens.enity";
import {FailedToRefreshTokenForbidden} from "../auth.exceptions";
import {IsNull} from "typeorm";

@Injectable()
export class RefreshTokensService {
    constructor(private repo: RefreshTokensRepository, private settings: Settings) {
    }

    async create(dto: CreateRefreshTokenDto): Promise<RefreshToken> {
        return this.repo.create({
            userAgent: dto.userAgent,
            userId: dto.userId,
            authorIp: dto.authorIp,
            body: Buffer.from(uuid4()).toString("base64"),
            expireAt: addMinutes(new Date(), this.settings.vars.REFRESH_TOKEN_LIFETIME_IN_MINUTES),
        });
    }

    async revoke(body: string) {
        return this.repo.updateOne({body, revokedAt: IsNull()}, {revokedAt: new Date()});
    }

    async isRevoked(body: string) {
        return this.repo.getByPk(body).then(value => !!value?.revokedAt);
    }


    async refresh(body: string, dto: CreateRefreshTokenDto): Promise<RefreshToken> {
        const oldToken = await this.revoke(body);
        if (oldToken?.userId !== dto.userId) {
            raise(FailedToRefreshTokenForbidden);
        }
        return this.create(dto);
    }
}
