import {Test, TestingModule} from "@nestjs/testing";
import {RefreshTokensService} from "./refresh-tokens.service";
import {RefreshTokensRepository} from "./refresh-tokens.repository";
import {CommonModule} from "../../common/common.module";
import {UsersModule} from "../users/users.module";
import {UsersRepository} from "../users/users.repository";
import {userData} from "../../../test/fixtures/test-consts";
import {User} from "../users/users.entity";
import {RefreshToken} from "./refresh-tokens.enity";
import {uuid4} from "backend-batteries";
import {expectError} from "../../helpers/tests-utils/expect-error";
import {FailedToRefreshTokenForbidden} from "../auth.exceptions";

describe("RefreshTokensService", () => {
    let service: RefreshTokensService;
    let user: User;
    let token: RefreshToken;
    let repo: RefreshTokensRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CommonModule, UsersModule],
            providers: [RefreshTokensService, RefreshTokensRepository, UsersRepository],
        }).compile();

        service = module.get<RefreshTokensService>(RefreshTokensService);
        repo = module.get(RefreshTokensRepository);
        const usersRepo = module.get(UsersRepository);
        user = await usersRepo.create(userData);
        token = await service.create({userAgent: "", userId: user.id, authorIp: ""});
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("revoke", () => {
        it("should revoke token", async () => {
            const result = await service.revoke(token.body);
            expect(result?.body).toBe(token.body);
            expect(result?.revokedAt).not.toBeNull();
        });

        it("should return undefined if token already revoked", async () => {
            await repo.updateOne({body: token.body}, {revokedAt: new Date()});
            const result = await service.revoke(token.body);
            expect(result).toBeUndefined();
        });
    });

    describe("isRevoked", () => {
        it("should return revoked state", async () => {
            expect(await service.isRevoked(token.body)).toBe(false);
            await repo.updateOne({body: token.body}, {revokedAt: new Date()});
            expect(await service.isRevoked(token.body)).toBe(true);
        });
    });

    describe("refresh", () => {
        it("should create new token and revoke old token", async () => {
            const result = await service.refresh(token.body, {userId: user.id, authorIp: "", userAgent: ""});
            expect(result.body).not.toBe(token.body);
            expect(result.revokedAt).toBeNull();
            token = (await repo.getByPk(token.body))!;
            expect(token.revokedAt).not.toBeNull();
        });

        it("should raise error if userId mismatch", async () => {
            await expectError(
                service.refresh(token.body, {userId: uuid4(), authorIp: "", userAgent: ""}),
                new FailedToRefreshTokenForbidden,
            );
        });
    });
});
