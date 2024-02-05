import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {UsersRepository} from "./users.repository";
import {PasswordsService} from "../passwords/passwords.service";

@Module({
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, PasswordsService],
})
export class UsersModule {
}
