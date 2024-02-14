import {Injectable} from "@nestjs/common";
import {UsersService} from "./users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "./users/users.model";
import {PasswordsService} from "./passwords/passwords.service";
import {raise} from "backend-batteries";
import {NotValidELoginOrPassword} from "./auth.exceptions";
import {RefreshTokensService} from "./refresh-tokens/refresh-tokens.service";
import {pick} from "radash";
import {CreateRefreshTokenDto} from "./refresh-tokens/refresh-tokens.schemas";
import {RefreshToken} from "./refresh-tokens/refresh-tokens.model";

export type IJwtPayload = {
    sub: string;
    firstName?: string;
    lastName?: string;
    birthdate?: string | undefined;
    username: string
};

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService, private passwordsService: PasswordsService, private refreshTokensService: RefreshTokensService) {
    }

    async authByEmailAndPassword(email: string, plainTextPassword: string): Promise<User> {
        const user = await this.usersService.findByEmail(email) || raise(NotValidELoginOrPassword);
        if (await this.passwordsService.check(plainTextPassword, user.password)) {
            return user;
        }
        raise(NotValidELoginOrPassword);
    }

    private async loginAs(user: User, createRefreshTokenDto: Omit<CreateRefreshTokenDto, "userId">) {
        const payload: IJwtPayload = {
            sub: user.id,
            birthdate: user.birthdate?.toISOString(),
            ...pick(user, ["username", "firstName", "lastName"]),
        };
        const refreshToken = await this.refreshTokensService.create({userId: user.id, ...createRefreshTokenDto});
        return {
            accessToken: await this.jwtService.signAsync(payload),
            refreshToken: refreshToken,
        };
    }

    async login(email: string, plainTextPassword: string, createRefreshTokenDto: Omit<CreateRefreshTokenDto, "userId">) {
        const user = await this.authByEmailAndPassword(email, plainTextPassword);
        return this.loginAs(user, createRefreshTokenDto);
    }

    async revokeTokens(refreshTokenBody: string | undefined) {
        if (refreshTokenBody) {
            await this.refreshTokensService.revoke(refreshTokenBody);
        }
    }

    async refreshTokens(refreshTokenBody: string, jwtPayload: IJwtPayload, extraUserData: Omit<CreateRefreshTokenDto, "userId">): Promise<[RefreshToken, string]> {
        const accessToken = await this.jwtService.signAsync(jwtPayload);
        const refreshToken = await this.refreshTokensService.refresh(refreshTokenBody, {
            ...extraUserData,
            userId: jwtPayload.sub,
        });
        return [refreshToken, accessToken];
    };
}
