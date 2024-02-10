import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {UsersRepository} from "./users.repository";
import {PasswordsService} from "../passwords/passwords.service";

@Module({
    controllers: [UsersController],
    providers: [PasswordsService, UsersService, UsersRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule {
}
