import {Body, Controller, Get, Param, ParseUUIDPipe, Post, Put} from "@nestjs/common";
import {UsersService} from "./users.service";
import {raise, UUID} from "backend-batteries";
import {PrivateUserDto, PublicUserDto, SignupDto, UpdateUserDto} from "./users.schemas";
import {UserNotFound} from "../auth.exceptions";
import {ParseResponse} from "../../helpers/decorators/parse-response";


@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post("sign-up")
    @ParseResponse({type: PrivateUserDto})
    signup(@Body() signupDto: SignupDto) {
        return this.usersService.signup(signupDto);
    }

    @Get("users")
    @ParseResponse({type: PublicUserDto, isArray: true})
    findAll() {
        return this.usersService.findAll();
    }

    @Get("users/:id")
    @ParseResponse({type: PublicUserDto})
    async findOne(@Param("id", ParseUUIDPipe) id: UUID) {
        return await this.usersService.findOne(id) || raise(UserNotFound);
    }

    @Put("users/:id")
    @ParseResponse({type: PrivateUserDto})
    async update(@Param("id", ParseUUIDPipe) id: UUID, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.update(id, updateUserDto) || raise(UserNotFound);
    }
}
