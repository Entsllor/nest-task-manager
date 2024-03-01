import {Test, TestingModule} from "@nestjs/testing";
import {TasksController} from "./tasks.controller";
import {generateMock} from "@anatine/zod-mock";
import {CreateTaskSchema, TaskSchema} from "./tasks.schemas";
import {uuid4} from "backend-batteries";
import {TasksService} from "./tasks.service";
import {faker} from "@faker-js/faker";
import {TaskNotFound} from "../task-manager.exceptions";
import {expectError} from "../../helpers/tests-utils/expect-error";
import {expectSchema} from "../../helpers/tests-utils/expect-schema";
import {Task} from "./tasks.entity";
import {CommonModule} from "../../common/common.module";
import {TasksRepository} from "./tasks.repository";
import {User} from "../../auth/users/users.entity";
import {initTestUser} from "../../../test/fixtures/init-test-user";
import {AuthModule} from "../../auth/auth.module";
import {TeamsModule} from "../../teams/teams.module";
import {BoardsModule} from "../boards/boards.module";

describe("TasksController", () => {
    let controller: TasksController;
    let service: TasksService;
    let user: User;

    function createTask(): Promise<Task> {
        return Promise.resolve(generateMock(TaskSchema)) as any;
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [TasksService, TasksRepository],
            imports: [CommonModule, TeamsModule, BoardsModule, AuthModule],
        }).compile();

        controller = module.get(TasksController);
        service = module.get(TasksService);
        user = await initTestUser(module);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create task", async () => {
            const taskMock = await createTask();
            jest.spyOn(service, "create").mockImplementation(async () => Promise.resolve(taskMock));
            const task = await controller.create(generateMock(CreateTaskSchema), uuid4());
            expect(task).toEqual(TaskSchema.parse(task));
        });
    });

    describe("read one", () => {
        it("should return task if found", async () => {
            const task = await createTask();
            jest.spyOn(service, "getOne").mockImplementation(async () => Promise.resolve(task));
            const gottenTask = await controller.getOne(task.id, user.id);
            expectSchema(TaskSchema, gottenTask);
        });

        it("should raise if not found", async () => {
            await expectError(controller.getOne(uuid4(), user.id), new TaskNotFound);
        });
    });

    describe("read many", () => {
        it("should return empty array if not found", async () => {
            const tasks = await controller.getMany(user.id);
            expect(tasks).toEqual([]);
        });

        it("should return tasks if found", async () => {
            const task = await createTask();
            jest.spyOn(service, "getMany").mockImplementation(async () => Promise.resolve([task]));
            const tasks = await controller.getMany(user.id);
            expect(tasks).toEqual([task]);
            expectSchema(TaskSchema.array(), tasks);
        });
    });

    describe("update", () => {
        it("should update one", async () => {
            const task = await createTask();
            jest.spyOn(service, "update").mockImplementation(async () => Promise.resolve(task));
            expectSchema(TaskSchema, await controller.update(task.id, {}, user.id));
        });

        it("should raise error if not found", async () => {
            jest.spyOn(service, "update").mockImplementation(async () => undefined);
            await expectError(controller.update(uuid4(), {title: faker.word.words()}, user.id), new TaskNotFound);
        });
    });

    describe("delete", () => {
        it("should delete if exists", async () => {
            const task = await createTask();
            jest.spyOn(service, "delete").mockImplementation(async () => true);
            const result = await controller.delete(task.id, user.id);
            expect(result).toEqual({ok: true});
        });

        it("should return false if not exists", async () => {
            jest.spyOn(service, "delete").mockImplementation(async () => false);
            const action = controller.delete(uuid4(), user.id);
            await expectError(action, new TaskNotFound);
        });
    });
});
