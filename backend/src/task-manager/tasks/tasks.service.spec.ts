import {Test, TestingModule} from "@nestjs/testing";
import {TasksService} from "./tasks.service";
import {generateMock} from "@anatine/zod-mock";
import {CreateTaskSchema} from "./tasks.schemas";
import {uuid4} from "backend-batteries";
import {faker} from "@faker-js/faker";
import {CommonModule} from "../../common/common.module";
import {TasksRepository} from "./tasks.repository";
import {User} from "../../auth/users/users.entity";
import {initTestUser} from "../../../test/fixtures/init-test-user";
import {UsersModule} from "../../auth/users/users.module";
import {AuthModule} from "../../auth/auth.module";
import {BoardsModule} from "../boards/boards.module";
import {Board} from "../boards/boards.entity";
import {BoardsService} from "../boards/boards.service";
import {TeamsModule} from "../../teams/teams.module";
import {expectError} from "../../helpers/tests-utils/expect-error";
import {TaskNotFound} from "../task-manager.exceptions";

describe("TasksService", () => {
    let service: TasksService;
    let user: User;
    let board: Board;

    async function createTask() {
        return service.create({...generateMock(CreateTaskSchema), boardId: board.id}, user.id);
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CommonModule, UsersModule, BoardsModule, TeamsModule],
            providers: [BoardsService, TasksRepository, TasksService, AuthModule],
        }).compile();

        service = module.get<TasksService>(TasksService);
        user = await initTestUser(module);
        board = await module.get(BoardsService).create({name: "test board"}, user.id);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create", async () => {
            const task = await createTask();
            expect(typeof task.id).toBe("string");
        });
    });

    describe("read", () => {
        it("should raise error if not found", async () => {
            await expectError(service.getOne(uuid4(), user.id), TaskNotFound);
        });

        it("should return one if found", async () => {
            const task = await createTask();
            expect(await service.getOne(task.id, user.id)).toBeDefined();
        });
    });

    describe("read many", () => {
        it("should return empty array if not found", async () => {
            const tasks = await service.getMany(user.id, {});
            expect(tasks).toEqual([]);
        });

        it("should return many if found", async () => {
            const task = await createTask();
            const tasks = await service.getMany(user.id, {});
            expect(tasks).toEqual([task]);
        });
    });

    describe("update", () => {
        it("should update one", async () => {
            const task = await createTask();
            const newTitle = task.title + "NEW";
            const updatedTask = await service.update(task.id, {title: newTitle}, user.id);
            expect(updatedTask).toHaveProperty("title", newTitle);
        });

        it("should raise error if not found", async () => {
            await expectError(service.update(uuid4(), {title: faker.word.words()}, user.id), TaskNotFound);
        });
    });

    describe("delete", () => {
        it("should delete and return true if exists", async () => {
            const task = await createTask();
            expect(await service.delete(task.id, user.id)).toBe(true);
            await expectError(service.getOne(task.id, user.id), TaskNotFound);
        });

        it("should return false if not exists", async () => {
            await expectError(service.delete(uuid4(), user.id), TaskNotFound);
        });
    });
});
