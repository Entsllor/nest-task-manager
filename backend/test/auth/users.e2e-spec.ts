import {initHttpClient} from "../fixtures/init-http-client";
import TestAgent from "supertest/lib/agent";
import {generateMock} from "@anatine/zod-mock";
import {PrivateUserSchema, PublicUserSchema, SignupSchema} from "../../src/auth/users/users.schemas";
import {doSatisfies} from "../helpers/do-satisfies";
import {doNotSatisfies} from "../helpers/do-not-satisfies";

describe("users", () => {
    let client: TestAgent;

    beforeEach(async () => {
        client = await initHttpClient();
    });

    describe("sign-up", () => {
        it("should create user", async () => {
            await client.post("/sign-up/").send(generateMock(SignupSchema)).expect(doSatisfies(PrivateUserSchema));
        });
    });

    describe("read-users", () => {
        it("should return users", async () => {
            await client.post("/sign-up/").send(generateMock(SignupSchema));
            await client.get("/users/").expect(doSatisfies(PublicUserSchema.array())).expect(doNotSatisfies(PrivateUserSchema.array()));
        });
    });
});
