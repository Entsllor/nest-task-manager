import {Body, Controller, Post, Req} from "@nestjs/common";
import {Public} from "./decorators/public.decorator";
import {ParseResponse} from "../helpers/decorators/parse-response";
import {LoginDto, PrivateUserDto, SignupDto} from "./users/users.schemas";
import {UsersService} from "./users/users.service";
import {AuthService, IJwtPayload} from "./auth.service";
import {AllowExpiredJwt} from "./decorators/allow-expired.jwt";
import {JwtPayload} from "./decorators/jwt-payload.decorator";
import {RefreshTokenBody} from "./refresh-tokens/refresh-tokens.pipe";
import {raise} from "backend-batteries";
import {FailedToParseClientIp} from "./auth.exceptions";
import {IRequest} from "../helpers/types/util-types";

import {CookiesService} from "../common/cookies/cookies.service";
import {OpenApiSettings} from "../helpers/decorators/open-api-settings";
import {ApiBearerAuth, ApiResponse} from "@nestjs/swagger";
import {AccessTokenBody} from "./jwt/jwt.pipe";

@OpenApiSettings("auth", {auth: "public"})
@Controller("auth")
export class AuthController {
    constructor(private readonly usersService: UsersService, private authService: AuthService, private cookies: CookiesService) {
    }

    @Public()
    @Post("sign-up")
    @ParseResponse({type: PrivateUserDto})
    signup(@Body() signupDto: SignupDto) {
        return this.usersService.signup(signupDto);
    }

    @Post("refresh")
    @ApiBearerAuth()
    @AllowExpiredJwt()
    async refresh(@RefreshTokenBody() refreshTokenBody: string, @JwtPayload() payload: IJwtPayload, @Req() req: IRequest) {
        const [refreshToken, accessToken] = await this.authService.refreshTokens(refreshTokenBody, payload, {
            authorIp: req.ip || raise(FailedToParseClientIp),
            userAgent: req.get("User-Agent") || "undefined",
        });
        this.cookies.setRefreshToken(refreshToken);
        return {accessToken};
    }

    @Public()
    @Post("login")
    async login(@Body() loginDto: LoginDto, @Req() req: IRequest) {
        const {
            accessToken,
            refreshToken,
        } = await this.authService.login(loginDto.email, loginDto.password, {
            authorIp: req.ip || raise(FailedToParseClientIp),
            userAgent: req.get("User-Agent") || "undefined",
        });
        this.cookies.setRefreshToken(refreshToken);
        return {accessToken};
    }

    @Post("logout")
    @Public()
    @ApiResponse({status: 204})
    async logout(@RefreshTokenBody({optional: true}) refreshTokenBody: string | undefined, @AccessTokenBody({optional: true}) accessToken: string) {
        this.cookies.unsetRefreshToken();
        await this.authService.revokeTokens(refreshTokenBody, accessToken);
    }
}
