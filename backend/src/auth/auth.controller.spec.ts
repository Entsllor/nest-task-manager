import {Test, TestingModule} from "@nestjs/testing";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UsersService} from "./users/users.service";
import {CookiesService} from "../common/cookies/cookies.service";
import {AuthModule} from "./auth.module";
import {CommonModule} from "../common/common.module";
import {PasswordsService} from "./passwords/passwords.service";
import {UsersModule} from "./users/users.module";
import {JwtService} from "@nestjs/jwt";
import {RefreshTokensService} from "./refresh-tokens/refresh-tokens.service";
import {RefreshTokensRepository} from "./refresh-tokens/refresh-tokens.repository";
import {DummyPasswordsService} from "./passwords/dummy.passwords.service";
import {JwtBlockList} from "./jwt/jwt.blocklist";

describe("AuthController", () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [UsersService, CookiesService, AuthService, JwtBlockList, {
                provide: PasswordsService,
                useClass: DummyPasswordsService,
            }, JwtService, RefreshTokensService, RefreshTokensRepository],
            imports: [AuthModule, UsersModule, CommonModule],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
