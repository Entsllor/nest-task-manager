import {Injectable} from "@nestjs/common";
import {UsersService} from "./users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "./users/users.model";
import {PasswordsService} from "./passwords/passwords.service";
import {raise} from "backend-batteries";
import {NotValidELoginOrPassword} from "./auth.exceptions";
import {RefreshTokensService} from "./refresh-tokens/refresh-tokens.service";
import {Settings} from "../common/settings/settings.service";
import {addMinutes} from "date-fns";
import {pick} from "radash";

export type IJwtPayload = {
    sub: string;
    firstName?: string;
    lastName?: string;
    birthdate?: string | undefined;
    username: string
};

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService, private passwordsService: PasswordsService, private refreshTokensService: RefreshTokensService, private settings: Settings) {
    }

    async authByEmailAndPassword(email: string, plainTextPassword: string): Promise<User> {
        const user = await this.usersService.findByEmail(email) || raise(NotValidELoginOrPassword);
        if (await this.passwordsService.check(plainTextPassword, user.password)) {
            return user;
        }
        raise(NotValidELoginOrPassword);
    }

    async loginAs(user: User): Promise<{accessToken: string, refreshToken: string, refreshTokenExpiresIn: Date}> {
        const payload: IJwtPayload = {
            sub: user.id,
            birthdate: user.birthdate?.toISOString(),
            ...pick(user, ["username", "firstName", "lastName"]),
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
            refreshToken: await this.refreshTokensService.create(),
            refreshTokenExpiresIn: addMinutes(new Date(), this.settings.vars.REFRESH_TOKEN_LIFETIME_IN_MINUTES),
        };
    }

    async login(email: string, plainTextPassword: string) {
        const user = await this.authByEmailAndPassword(email, plainTextPassword);
        return this.loginAs(user);
    }
}
