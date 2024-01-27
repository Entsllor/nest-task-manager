import {Test, TestingModule} from "@nestjs/testing";
import {TasksController} from "./tasks.controller";
import {generateMock} from "@anatine/zod-mock";
import {CreateTaskSchema, TaskSchema} from "./tasks.schemas";
import {uuid4} from "backend-batteries";
import {TasksService} from "./tasks.service";
import {faker} from "@faker-js/faker";
import {TaskNotFound} from "../task-manager.exceptions";
import {expectError} from "../../helpers/tests-utils/expectError";

describe("TasksController", () => {
    let controller: TasksController;
    let service: TasksService;

    function createTask() {
        return Promise.resolve(generateMock(TaskSchema));
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [TasksService],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get(TasksService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create task", async () => {
            const task = await controller.create(generateMock(CreateTaskSchema));
            expect(task).toEqual(TaskSchema.parse(task));
        });
    });

    describe("read one", () => {
        it("should return task if found", async () => {
            const task = await createTask();
            jest.spyOn(service, "getOne").mockImplementation(async () => Promise.resolve(task));
            const gottenTask = await controller.getOne(task.id);
            expect(gottenTask).toEqual(TaskSchema.parse(task));
        });

        it("should raise if not found", async () => {
            await expectError(controller.getOne(uuid4()), new TaskNotFound);
        });
    });

    describe("read many", () => {
        it("should return empty array if not found", async () => {
            const tasks = await controller.getMany();
            expect(tasks).toEqual([]);
        });

        it("should return tasks if found", async () => {
            const task = await createTask();
            jest.spyOn(service, "getMany").mockImplementation(async () => Promise.resolve([task]));
            const tasks = await controller.getMany();
            expect(tasks).toEqual([task]);
        });
    });

    describe("update", () => {
        it("should update one", async () => {
            const task = await createTask();
            jest.spyOn(service, "update").mockImplementation(async () => Promise.resolve(task));
            expect(await controller.update(task.id, {})).toEqual(TaskSchema.parse(task));
        });

        it("should raise error if not found", async () => {
            jest.spyOn(service, "update").mockImplementation(async () => undefined);
            await expectError(controller.update(uuid4(), {title: faker.word.words()}), new TaskNotFound);
        });
    });

    describe("delete", () => {
        it("should delete if exists", async () => {
            const task = await createTask();
            jest.spyOn(service, "delete").mockImplementation(async () => true);
            const result = await controller.delete(task.id);
            expect(result).toEqual({ok: true});
        });

        it("should return false if not exists", async () => {
            jest.spyOn(service, "delete").mockImplementation(async () => false);
            const action = controller.delete(uuid4());
            await expectError(action, new TaskNotFound);
        });
    });
});
