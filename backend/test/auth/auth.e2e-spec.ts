import {initHttpClient} from "../fixtures/init-http-client";
import {PrivateUserSchema} from "../../src/auth/users/users.schemas";
import {doSatisfies} from "../helpers/do-satisfies";
import {z} from "nestjs-zod/z";
import {SuperTest} from "supertest";
import {userData} from "../fixtures/test-consts";
import {initUserClient} from "../fixtures/init-user-client";
import {hasResponseError} from "../helpers/has-response-error";
import {
    FailedToRefreshTokenForbidden,
    NotValidELoginOrPassword,
    RefreshTokenRequired,
} from "../../src/auth/auth.exceptions";

describe("sign-up", () => {
    it("should create user", async () => {
        const client = await initHttpClient();
        await client.post("/auth/sign-up").send(userData).expect(doSatisfies(PrivateUserSchema));
    });
});

describe("users", () => {
    let client: SuperTest;
    let userClient: SuperTest;

    beforeEach(async () => {
        client = await initHttpClient();
        userClient = await initUserClient();
    });


    describe("login", () => {
        it("should return tokens", async () => {
            await client.post("/auth/login").send({
                email: userData.email,
                password: userData.password,
            }).expect(201).expect(doSatisfies(z.object({accessToken: z.string()})));
        });

        it("should raise error if email mismatch", async () => {
            await client.post("/auth/login").send({
                email: "wrong" + userData.email,
                password: userData.password,
            }).expect(hasResponseError(NotValidELoginOrPassword));
        });

        it("should raise error if password mismatch", async () => {
            await client.post("/auth/login").send({
                email: userData.email,
                password: "wrong" + userData.password,
            }).expect(hasResponseError(NotValidELoginOrPassword));
        });
    });

    describe('logout', () => {
        it("should remove refresh token from cookies", async () => {
            const response = await userClient.post("/auth/logout").send().expect(201);
            expect(response.headers["set-cookie"][0]).toContain("refreshToken=undefined");
            await userClient.post("/auth/refresh").send().expect(403);
        });

        it("should be ok if have not refresh token", async () => {
            const response = await userClient.post("/auth/logout").set('Cookie', []).send().expect(201);
            expect(response.headers["set-cookie"][0]).toContain("refreshToken=undefined");
        });
    })

    describe("refresh", () => {
        it("should refresh tokens", async () => {
            const response = await userClient.post("/auth/refresh").send().expect(201);
            expect(response.headers["set-cookie"][0]).toContain("refreshToken");
            expect(typeof response.body.accessToken).toBe("string");
        });

        it("should require access token", async () => {
            await userClient.post("/auth/refresh").unset("Authorization").send().expect(401);
        });

        it("should require refresh token", async () => {
            await userClient.post("/auth/refresh")
                .set("Cookie", []).send()
                .expect(hasResponseError(RefreshTokenRequired));
        });

        it("should require valid refresh token", async () => {
            await userClient.post("/auth/refresh")
                .set("Cookie", ["refreshToken=invalid"]).send()
                .expect(hasResponseError(FailedToRefreshTokenForbidden));
        });
    });
});
