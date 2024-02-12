import {Test, TestingModule} from "@nestjs/testing";
import {UsersService} from "./users.service";
import {UsersRepository} from "./users.repository";
import {CommonModule} from "../../common/common.module";
import {PasswordsService} from "../passwords/passwords.service";
import {generateMock} from "@anatine/zod-mock";
import {SignupSchema} from "./users.schemas";
import {User} from "./users.model";
import {expectError} from "../../helpers/tests-utils/expect-error";
import {NotUniqueEmail, NotUniqueUsername} from "../auth.exceptions";
import {DummyPasswordsService} from "../passwords/dummy.passwords.service";
import {IPasswordsService} from "../passwords/passwords.types";
import {uuid4} from "backend-batteries";
import {faker} from "@faker-js/faker";
import spyOn = jest.spyOn;


describe("UsersService", () => {
    let service: UsersService;
    let repo: UsersRepository;
    let passwordService: IPasswordsService;
    const userData = generateMock(SignupSchema);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CommonModule],
            providers: [UsersService, UsersRepository, {provide: PasswordsService, useClass: DummyPasswordsService}],
        }).compile();

        service = module.get(UsersService);
        repo = module.get(UsersRepository);
        passwordService = module.get(PasswordsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    async function createUser() {
        return repo.create(userData);
    }

    describe("sign-up", () => {
        it("should create user", async () => {
            const user = await service.signup(userData);
            expect(user).toBeInstanceOf(User);
            expect(user.password).not.toEqual(userData.password);
            expect(await passwordService.check(userData.password, user.password)).toBe(true);
        });

        it("should raise not-unique-email if the email is not unique", async () => {
            await repo.create({...generateMock(SignupSchema), email: userData.email});
            await expectError(service.signup(userData), new NotUniqueEmail);
        });

        it("should raise not-unique-username if the username is not unique", async () => {
            await repo.create({...generateMock(SignupSchema), username: userData.username});
            await expectError(service.signup(userData), new NotUniqueUsername);
        });
    });

    describe("find all", () => {
        it("should should return all users", async () => {
            spyOn(service, "findAll").mockImplementation(() => Promise.resolve([]));
            expect(await service.findAll()).toEqual([]);
            const user = await createUser();
            spyOn(service, "findAll").mockImplementation(() => Promise.resolve([user]));
            expect(await service.findAll()).toEqual([user]);
        });
    });
    describe("find one", () => {
        it("should find one", async () => {
            const user = await createUser();
            spyOn(repo, "first").mockImplementation(() => Promise.resolve(user));
            expect(await service.findOne(user.id)).toEqual(user);
        });
    });

    describe("update user", () => {
        it("should update user", async () => {
            const user = await createUser();
            const newLastName = faker.person.lastName();
            await service.update(user.id, {lastName: newLastName});
            const updatedUser = await repo.getByPk(user.id);
            expect(updatedUser).toEqual({...user, lastName: newLastName, updatedAt: updatedUser?.updatedAt});
        });

        it("should return undefined if not found", async () => {
            expect(await service.update(uuid4(), {lastName: faker.person.lastName()})).toBeUndefined();
        });
    });
});
