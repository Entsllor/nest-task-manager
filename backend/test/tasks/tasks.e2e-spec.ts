import {initUserClient} from "../fixtures/init-user-client";
import {SuperTest} from "supertest";
import {faker} from "@faker-js/faker";
import {doSatisfies} from "../helpers/do-satisfies";
import {TaskDto, TaskSchema} from "../../src/task-manager/tasks/tasks.schemas";
import {factories, testUser} from "../setupTests";
import {Task} from "../../src/task-manager/tasks/tasks.entity";
import {Factory} from "../helpers/factory";
import {Board} from "../../src/task-manager/boards/boards.entity";
import {hasResponseError} from "../helpers/has-response-error";
import {Forbidden, uuid4} from "backend-batteries";
import {TaskNotFound} from "../../src/task-manager/task-manager.exceptions";

describe("tasks", () => {
    let userClient: SuperTest;
    let taskFactory: Factory<Task>;
    beforeEach(async () => {
            userClient = await initUserClient();
            taskFactory = factories.get(Task);
        },
    );

    describe("create tasks", () => {
        it("should create task and board", async () => {
            const response = await userClient.post("/tasks").send({title: faker.word.noun()})
                .expect(201)
                .expect(doSatisfies(TaskDto));
            const task: TaskDto = response.body;
            expect(typeof task.boardId).toBe("number");
            await userClient.get(`/tasks/${task.id}`).expect(200).expect(doSatisfies(TaskDto));
        });
    });

    describe("update tasks", () => {
        it("should update task title", async () => {
            const task = await taskFactory.create({author: testUser});
            const updatedTitle = faker.word.noun();
            const result = await userClient.put(`/tasks/${task.id}`).send({title: updatedTitle}).expect(200);
            expect(result.body.title).toBe(updatedTitle);
        });

        it("should return 404 if not found", async () => {
            await userClient.put(`/tasks/${uuid4()}`).expect(hasResponseError(TaskNotFound));
        });

        it("should return 403 if has no rights", async () => {
            const task = await taskFactory.create();
            await userClient.put(`/tasks/${task.id}`).expect(hasResponseError(Forbidden));
        });
    });

    describe("delete tasks", () => {
        it("should delete a task", async () => {
            // Create a task to be deleted
            const task = await taskFactory.create({author: testUser});
            await userClient.delete(`/tasks/${task.id}`).expect(204);
        });

        it("should return 404 if not found", async () => {
            await userClient.delete(`/tasks/${uuid4()}`).expect(hasResponseError(TaskNotFound));
        });

        it("should return 403 if has no rights", async () => {
            const task = await taskFactory.create();
            await userClient.delete(`/tasks/${task.id}`).expect(hasResponseError(Forbidden));
        });
    });


    describe("read many", () => {
        it("should return tasks from available boards", async () => {
            const board = await factories.get(Board).create({author: testUser});
            const myTasks = await taskFactory.bulkCreate(3, {board});
            await taskFactory.bulkCreate(5);
            const resp = await userClient.get("/tasks").expect(200).expect(doSatisfies(TaskSchema.array()));
            expect(myTasks.map(i => i.id)).toEqual(resp.body.map((i: Task) => i.id));
        });
    });


    describe("read one", () => {
        it("should return task if available", async () => {
            const task = await taskFactory.create({author: testUser});
            const resp = await userClient.get(`/tasks/${task.id}`).expect(200).expect(doSatisfies(TaskSchema));
            expect(resp.body.id).toBe(task.id);
        });

        it("should return 404 if not found", async () => {
            await userClient.get(`/tasks/${uuid4()}`).expect(404).expect(hasResponseError(TaskNotFound));
        });

        it("should return 403 if not available", async () => {
            const task = await taskFactory.create();
            await userClient.get(`/tasks/${task.id}`).expect(403).expect(hasResponseError(Forbidden));
        });
    });
});
