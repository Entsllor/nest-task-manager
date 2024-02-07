import {Test, TestingModule} from "@nestjs/testing";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {UsersRepository} from "./users.repository";
import {PasswordsService} from "../passwords/passwords.service";
import {CommonModule} from "../../common/common.module";
import {generateMock} from "@anatine/zod-mock";
import {SignupSchema} from "./users.schemas";
import {uuid4} from "backend-batteries";
import {faker} from "@faker-js/faker";
import {DummyPasswordsService} from "../passwords/dummy.passwords.service";
import {User} from "./users.model";
import {expectError} from "../../helpers/tests-utils/expect-error";
import {UserNotFound} from "../auth.exceptions";
import spyOn = jest.spyOn;

describe("UsersController", () => {
    let controller: UsersController;
    let service: UsersService;
    let repo: UsersRepository;
    const userData = generateMock(SignupSchema);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            imports: [CommonModule],
            providers: [UsersService, UsersRepository, {provide: PasswordsService, useClass: DummyPasswordsService}],
        }).compile();

        service = module.get(UsersService);
        repo = module.get(UsersRepository);
        controller = module.get(UsersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    async function createUser() {
        return repo.create(userData);
    }

    describe("sign-up", () => {
        it("should create user", async () => {
            const user = createUser();
            spyOn(service, "signup").mockImplementation(() => Promise.resolve(user));
            const response = await controller.signup(userData);
            expect(response).toBeInstanceOf(User);
        });
    });

    describe("find all", () => {
        it("should should return all users", async () => {
            expect(await controller.findAll()).toEqual([]);
            const user = await createUser();
            expect(await controller.findAll()).toEqual([user]);
        });
    });
    describe("find one", () => {
        it("should find one", async () => {
            const user = await createUser();
            expect(await controller.findOne(user.id)).toEqual(user);
        });

        it("should return null if not exists", async () => {
            await expectError(controller.findOne(uuid4()), new UserNotFound);
        });
    });

    describe("update user", () => {
        it("should update user", async () => {
            const user = await createUser();
            const newLastName = faker.person.lastName();
            const result = await controller.update(user.id, {lastName: newLastName});
            expect(result).toEqual({...user, lastName: newLastName});
        });

        it("should return undefined if not found", async () => {
            await expectError(controller.update(uuid4(), {lastName: faker.person.lastName()}), new UserNotFound);
        });
    });
});
