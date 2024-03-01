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
import {JwtBlockList} from "./jwt/jwt.blocklist";
import {RefreshTokensModule} from "./refresh-tokens/refresh-tokens.module";

describe("AuthController", () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [UsersService, CookiesService, AuthService, JwtBlockList, PasswordsService, JwtService],
            imports: [AuthModule, UsersModule, CommonModule, RefreshTokensModule],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
