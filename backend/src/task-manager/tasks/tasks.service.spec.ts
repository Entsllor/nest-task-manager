import {Test, TestingModule} from "@nestjs/testing";
import {TasksService} from "./tasks.service";
import {generateMock} from "@anatine/zod-mock";
import {CreateTaskSchema} from "./tasks.schemas";
import {uuid4} from "backend-batteries";
import {faker} from "@faker-js/faker";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./tasks.model";
import {CommonModule} from "../../common/common.module";

describe("TasksService", () => {
    let service: TasksService;

    function createTask() {
        return service.create(generateMock(CreateTaskSchema));
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TasksService],
            imports: [CommonModule, TypeOrmModule.forFeature([Task])],
        }).compile();

        service = module.get<TasksService>(TasksService);
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
        it("should return undefined if not found", async () => {
            const task = await service.getOne(uuid4());
            expect(task).toBeUndefined();
        });

        it("should return one if found", async () => {
            const task = await createTask();
            expect(await service.getOne(task.id)).toBeDefined();
        });
    });

    describe("read many", () => {
        it("should return empty array if not found", async () => {
            const tasks = await service.getMany();
            expect(tasks).toEqual([]);
        });

        it("should return many if found", async () => {
            const task = await createTask();
            const tasks = await service.getMany();
            expect(tasks).toEqual([task]);
        });
    });

    describe("update", () => {
        it("should update one", async () => {
            const task = await createTask();
            const newTitle = task.title + "NEW";
            const updatedTask = await service.update(task.id, {title: newTitle});
            expect(updatedTask).toHaveProperty("title", newTitle);
        });

        it("should return undefined if not found", async () => {
            const result = await service.update(uuid4(), {title: faker.word.words()});
            expect(result).toBeUndefined();
        });
    });

    describe("delete", () => {
        it("should delete and return true if exists", async () => {
            const task = await createTask();
            expect(await service.delete(task.id)).toBe(true);
            expect(await service.getOne(task.id)).toBeUndefined();
        });

        it("should return false if not exists", async () => {
            expect(await service.delete(uuid4())).toBe(false);
        });
    });
});
