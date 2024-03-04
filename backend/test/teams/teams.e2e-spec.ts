import {initUserClient} from "../fixtures/init-user-client";
import {SuperTest} from "supertest";
import {faker} from "@faker-js/faker";
import {doSatisfies} from "../helpers/do-satisfies";
import {factories, testUser} from "../setupTests";
import {Factory} from "../helpers/factory";
import {hasResponseError} from "../helpers/has-response-error";
import {Forbidden} from "backend-batteries";
import {Team} from "../../src/teams/teams.entity";
import {TeamDto, TeamSchema} from "../../src/teams/teams.schemas";
import {TeamNotFound} from "../../src/teams/teams.exceptions";

describe("teams", () => {
    let userClient: SuperTest;
    let teamFactory: Factory<Team>;
    beforeEach(async () => {
            userClient = await initUserClient();
            teamFactory = factories.get(Team);
        },
    );

    describe("create teams", () => {
        it("should create team", async () => {
            const response = await userClient.post("/teams").send({name: faker.word.noun()})
                .expect(201)
                .expect(doSatisfies(TeamDto));
            const team: TeamDto = response.body;
            await userClient.get(`/teams/${team.id}`).expect(200).expect(doSatisfies(TeamDto));
        });
    });


    describe("read many", () => {
        it("should return available teams", async () => {
            const teams = await teamFactory.bulkCreate(3, {author: testUser});
            const resp = await userClient.get("/teams").expect(200).expect(doSatisfies(TeamSchema.array()));
            expect(teams.map(i => i.id)).toEqual(resp.body.map((i: Team) => i.id));
        });
    });


    describe("read one", () => {
        it("should return team if available", async () => {
            const team = await teamFactory.create({author: testUser});
            const resp = await userClient.get(`/teams/${team.id}`).expect(200).expect(doSatisfies(TeamSchema));
            expect(resp.body.id).toBe(team.id);
        });

        it("should return 404 if not found", async () => {
            await userClient.get(`/teams/${faker.number.int(1000)}`).expect(404).expect(hasResponseError(TeamNotFound));
        });

        it("should return 403 if not available", async () => {
            const team = await teamFactory.create();
            await userClient.get(`/teams/${team.id}`).expect(403).expect(hasResponseError(Forbidden));
        });
    });

    describe("update teams", () => {
        it("should update team name", async () => {
            const team = await teamFactory.create({author: testUser});
            const updatedTitle = faker.word.noun();
            const result = await userClient.put(`/teams/${team.id}`).send({name: updatedTitle}).expect(200);
            expect(result.body.name).toBe(updatedTitle);
        });

        it("should return 404 if not found", async () => {
            await userClient.put(`/teams/${faker.number.int(1000)}`).expect(hasResponseError(TeamNotFound));
        });

        it("should return 403 if has no rights", async () => {
            const team = await teamFactory.create();
            await userClient.put(`/teams/${team.id}`).expect(hasResponseError(Forbidden));
        });
    });

    describe("delete teams", () => {
        it("should delete a team", async () => {
            // Create a team to be deleted
            const team = await teamFactory.create({author: testUser});
            await userClient.delete(`/teams/${team.id}`).expect(204);
        });

        it("should return 404 if not found", async () => {
            await userClient.delete(`/teams/${faker.number.int(1000)}`).expect(hasResponseError(TeamNotFound));
        });

        it("should return 403 if has no rights", async () => {
            const team = await teamFactory.create();
            await userClient.delete(`/teams/${team.id}`).expect(hasResponseError(Forbidden));
        });
    });
});
