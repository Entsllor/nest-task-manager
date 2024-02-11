import {Body, Controller, Post, Response} from "@nestjs/common";
import {Public} from "./decorators/public.decorator";
import {ParseResponse} from "../helpers/decorators/parse-response";
import {LoginDto, PrivateUserDto, SignupDto} from "./users/users.schemas";
import {UsersService} from "./users/users.service";
import {AuthService, IJwtPayload} from "./auth.service";
import {HttpAdapterHost} from "@nestjs/core";
import {AllowExpiredJwt} from "./decorators/allow-expired.jwt";
import {JwtPayload} from "./decorators/jwt-payload.decorator";
import {RefreshToken} from "./refresh-tokens/refresh-tokens.pipe";

@Controller("auth")
export class AuthController {
    constructor(private readonly usersService: UsersService, private authService: AuthService, private httpAdapter: HttpAdapterHost) {
    }

    @Public()
    @Post("sign-up")
    @ParseResponse({type: PrivateUserDto})
    signup(@Body() signupDto: SignupDto) {
        return this.usersService.signup(signupDto);
    }

    @Post("refresh")
    @AllowExpiredJwt()
    async refresh(@RefreshToken() refreshToken: string, @JwtPayload() payload: IJwtPayload) {
        console.log(refreshToken);
        console.log(payload);
    }

    @Public()
    @Post("login")
    async login(@Body() loginDto: LoginDto, @Response({passthrough: true}) res: Response) {
        const {
            accessToken,
            refreshToken,
            refreshTokenExpiresIn,
        } = await this.authService.login(loginDto.email, loginDto.password);
        this.httpAdapter.httpAdapter.setHeader(
            res,
            "Set-Cookie",
            `refreshToken=${refreshToken}; Expires=${refreshTokenExpiresIn}; Path=/auth/refresh; Secure; SameSite=Strict; HttpOnly`,
        );
        return {accessToken};
    }
}
