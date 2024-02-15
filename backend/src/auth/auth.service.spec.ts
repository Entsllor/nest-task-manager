import {Test, TestingModule} from "@nestjs/testing";
import {AuthService} from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import {PasswordsService} from "./passwords/passwords.service";
import {RefreshTokensService} from "./refresh-tokens/refresh-tokens.service";
import {UsersService} from "./users/users.service";
import {CommonModule} from "../common/common.module";
import {Settings} from "../common/settings/settings.service";
import {UsersModule} from "./users/users.module";
import {RefreshTokensModule} from "./refresh-tokens/refresh-tokens.module";
import {RefreshTokensRepository} from "./refresh-tokens/refresh-tokens.repository";
import {generateMock} from "@anatine/zod-mock";
import {SignupSchema} from "./users/users.schemas";
import {expectError} from "../helpers/tests-utils/expect-error";
import {NotValidELoginOrPassword} from "./auth.exceptions";
import {RefreshToken} from "./refresh-tokens/refresh-tokens.model";
import {JwtBlockList} from "./jwt/jwt.blocklist";

describe("AuthService", () => {
    let service: AuthService;
    let userService: UsersService;
    let refreshTokensService: RefreshTokensService;
    const userData = generateMock(SignupSchema);

    async function createUser() {
        return userService.signup(userData);
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CommonModule, UsersModule, RefreshTokensModule, JwtModule.register({secret: "secret"})],
            providers: [AuthService, PasswordsService, RefreshTokensService, UsersService, Settings, RefreshTokensRepository, JwtBlockList],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get(UsersService);
        refreshTokensService = module.get(RefreshTokensService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("auth by email and password", () => {
        it("should return user if email and password match", async () => {
            const user = await createUser();
            const result = await service.authByEmailAndPassword(user.email, userData.password);
            expect(result).toEqual(user);
        });

        it("should raise error if email not match", async () => {
            const user = await createUser();
            await expectError(service.authByEmailAndPassword("wrong" + user.email, userData.password), new NotValidELoginOrPassword);
        });

        it("should raise error if password not match", async () => {
            const user = await createUser();
            await expectError(service.authByEmailAndPassword(user.email, "wrong" + userData.password), new NotValidELoginOrPassword);
        });
    });

    describe("login", () => {
        it("should return refresh and access tokens", async () => {
            const user = await createUser();
            const {refreshToken, accessToken} = await service.login(user.email, userData.password, {
                userAgent: "",
                authorIp: "",
            });
            expect(refreshToken).toBeInstanceOf(RefreshToken);
            expect(typeof accessToken).toBe("string");
        });
    });

    describe("refreshToken", () => {
        it("should refresh tokens", async () => {
            const user = await createUser();
            const refreshToken = await refreshTokensService.create({userId: user.id, userAgent: "", authorIp: ""});
            const [refresh, access] = await service.refreshTokens(refreshToken.body, {
                sub: user.id,
                username: user.username,
            }, {authorIp: "", userAgent: ""});
            expect(refresh).toBeInstanceOf(RefreshToken);
            expect(refresh.revokedAt).toBe(null);
            expect(await refreshTokensService.isRevoked(refreshToken.body)).toBe(true);
            expect(typeof access).toBe("string");
        });
    });
});
