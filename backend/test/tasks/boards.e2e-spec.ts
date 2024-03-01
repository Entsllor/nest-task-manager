import {initUserClient} from "../fixtures/init-user-client";
import {SuperTest} from "supertest";
import {faker} from "@faker-js/faker";
import {doSatisfies} from "../helpers/do-satisfies";
import {factories, testUser} from "../setupTests";
import {Factory} from "../helpers/factory";
import {hasResponseError} from "../helpers/has-response-error";
import {Forbidden} from "backend-batteries";
import {Board} from "../../src/task-manager/boards/boards.entity";
import {BoardDto, BoardSchema} from "../../src/task-manager/boards/boards.schemas";
import {BoardNotFound} from "../../src/task-manager/task-manager.exceptions";

describe("boards", () => {
    let userClient: SuperTest;
    let boardFactory: Factory<Board>;
    beforeEach(async () => {
            userClient = await initUserClient();
            boardFactory = factories.get(Board);
        },
    );

    describe("create boards", () => {
        it("should create board", async () => {
            const response = await userClient.post("/boards").send({name: faker.word.noun()})
                .expect(201)
                .expect(doSatisfies(BoardDto));
            const board: BoardDto = response.body;
            await userClient.get(`/boards/${board.id}`).expect(200).expect(doSatisfies(BoardDto));
        });
    });

    describe("read many", () => {
        it("should return boards from available boards", async () => {
            const boards = await boardFactory.bulkCreate(3, {author: testUser});
            const resp = await userClient.get("/boards").expect(200).expect(doSatisfies(BoardSchema.array()));
            expect(boards.map(i => i.id)).toEqual(resp.body.map((i: Board) => i.id));
        });
    });


    describe("read one", () => {
        it("should return board if available", async () => {
            const board = await boardFactory.create({author: testUser});
            const resp = await userClient.get(`/boards/${board.id}`).expect(200).expect(doSatisfies(BoardSchema));
            expect(resp.body.id).toBe(board.id);
        });

        it("should return 404 if not found", async () => {
            await userClient.get(`/boards/${faker.number.int(1000)}`).expect(404).expect(hasResponseError(BoardNotFound));
        });

        it("should return 403 if not available", async () => {
            const board = await boardFactory.create();
            await userClient.get(`/boards/${board.id}`).expect(403).expect(hasResponseError(Forbidden));
        });
    });

    describe("update boards", () => {
        it("should update board name", async () => {
            const board = await boardFactory.create({author: testUser});
            const updatedTitle = faker.word.noun();
            const result = await userClient.put(`/boards/${board.id}`).send({name: updatedTitle}).expect(200);
            expect(result.body.name).toBe(updatedTitle);
        });

        it("should return 404 if not found", async () => {
            await userClient.put(`/boards/${faker.number.int(1000)}`).expect(hasResponseError(BoardNotFound));
        });

        it("should return 403 if has no rights", async () => {
            const board = await boardFactory.create();
            await userClient.put(`/boards/${board.id}`).send({name: faker.word.noun()}).expect(hasResponseError(Forbidden));
        });
    });

    describe("delete boards", () => {
        it("should delete a board", async () => {
            // Create a board to be deleted
            const board = await boardFactory.create({author: testUser});
            await userClient.delete(`/boards/${board.id}`).expect(204);
        });

        it("should return 404 if not found", async () => {
            await userClient.delete(`/boards/${faker.number.int(1000)}`).expect(hasResponseError(BoardNotFound));
        });

        it("should return 403 if has no rights", async () => {
            const board = await boardFactory.create();
            await userClient.delete(`/boards/${board.id}`).expect(hasResponseError(Forbidden));
        });
    });
});
