import {Body, Controller, Get, Param, ParseUUIDPipe, Put} from "@nestjs/common";
import {UsersService} from "./users.service";
import {raise, UUID} from "backend-batteries";
import {PrivateUserDto, PublicUserDto, UpdateUserDto} from "./users.schemas";
import {UserNotFound} from "../auth.exceptions";
import {ParseResponse} from "../../helpers/decorators/parse-response";
import {CurrentUser} from "../decorators/current-user.pipe";
import {User} from "./users.model";
import {OpenApiSettings} from "../../helpers/decorators/open-api-settings";

@OpenApiSettings("users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get("me")
    @ParseResponse({type: PrivateUserDto})
    readMe(@CurrentUser() user: User) {
        return user;
    }

    @Get("")
    @ParseResponse({type: PublicUserDto, isArray: true})
    findAll() {
        return this.usersService.findAll();
    }

    @Get(":id")
    @ParseResponse({type: PublicUserDto})
    async findOne(@Param("id", ParseUUIDPipe) id: UUID) {
        return await this.usersService.findOne(id) || raise(UserNotFound);
    }

    @Put(":id")
    @ParseResponse({type: PrivateUserDto})
    async update(@Param("id", ParseUUIDPipe) id: UUID, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.update(id, updateUserDto) || raise(UserNotFound);
    }
}
