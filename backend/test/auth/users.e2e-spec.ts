import {PrivateUserSchema, PublicUserSchema} from "../../src/auth/users/users.schemas";
import {doSatisfies} from "../helpers/do-satisfies";
import {doNotSatisfies} from "../helpers/do-not-satisfies";
import {initUserClient} from "../fixtures/init-user-client";
import {SuperTest} from "supertest";

describe("users", () => {
    let userClient: SuperTest;
    beforeEach(async () => {
            userClient = await initUserClient();
        },
    );

    describe("read-users", () => {
        it("should return users", async () => {
            await userClient.get("/users/")
                .expect(200)
                .expect(doSatisfies(PublicUserSchema.array()))
                .expect(doNotSatisfies(PrivateUserSchema.array()));
        });
    });

    describe("read-me", () => {
        it("should return me", async () => {
            await userClient.get("/users/me")
                .expect(200)
                .expect(doSatisfies(PrivateUserSchema));
        });
    });
});
