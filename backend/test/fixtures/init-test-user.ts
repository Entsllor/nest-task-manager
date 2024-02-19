import {INestApplication} from "@nestjs/common";
import {UsersService} from "../../src/auth/users/users.service";
import {userData} from "./test-consts";
import {TestingModule} from "@nestjs/testing";

export async function initTestUser(app: INestApplication | TestingModule) {
    const service = app.get(UsersService);
    return service.signup(userData);
}
