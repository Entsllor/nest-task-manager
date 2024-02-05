import {Body, Controller, Get, Param, ParseUUIDPipe, Post, Put} from "@nestjs/common";
import {UsersService} from "./users.service";
import {raise, UUID} from "backend-batteries";
import {PrivateUserDto, PrivateUserSchema, PublicUserDto, SignupDto, UpdateUserDto} from "./users.schemas";
import {UserNotFound} from "../auth.exceptions";
import {ApiOkResponse} from "@nestjs/swagger";

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @ApiOkResponse({type: PrivateUserDto})
    @Post("sign-up")
    signup(@Body() signupDto: SignupDto) {
        return PrivateUserSchema.parse(this.usersService.signup(signupDto));
    }

    @Get("users")
    findAll() {
        return this.usersService.findAll();
    }

    @Get("users/:id")
    async findOne(@Param("id", ParseUUIDPipe) id: UUID) {
        return await this.usersService.findOne(id) || raise(UserNotFound);
    }

    @Put("users/:id")
    update(@Param("id", ParseUUIDPipe) id: UUID, @Body() updateUserDto: UpdateUserDto) {
        console.log("not implemented");
        return {...updateUserDto, id};
    }
}
