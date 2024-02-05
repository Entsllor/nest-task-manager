import {Test, TestingModule} from "@nestjs/testing";
import {UsersService} from "./users.service";
import {UsersRepository} from "./users.repository";
import {CommonModule} from "../../common/common.module";
import {DummyPasswordsService} from "../passwords/dummy.passwords.service";
import {PasswordsService} from "../passwords/passwords.service";

describe("UsersService", () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CommonModule],
            providers: [UsersService, UsersRepository, {provide: PasswordsService, useClass: DummyPasswordsService}],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
