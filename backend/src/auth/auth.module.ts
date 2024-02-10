import {Module} from "@nestjs/common";
import {UsersModule} from "./users/users.module";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {Settings} from "../common/settings/settings.service";
import {JwtStrategy} from "./jwt/jwt.strategy";
import {UsersService} from "./users/users.service";
import {PasswordsService} from "./passwords/passwords.service";
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import {CurrentUserPipe} from "./decorators/current-user.pipe";

@Module({
    imports: [UsersModule, JwtModule.registerAsync({
        inject: [Settings],
        useFactory: (settings: Settings) => ({
            secret:
            settings.vars.JWT_SECRET_KEY,
            signOptions: {expiresIn: settings.vars.JWT_LIFETIME_IN_MINUTES * 60},
        }),
    }), RefreshTokensModule],
    providers: [AuthService, PasswordsService, UsersService, CurrentUserPipe, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {
}
