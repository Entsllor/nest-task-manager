import {initHttpClient} from "./init-http-client";
import {userData} from "./test-consts";
import {logRespError} from "../helpers/log-resp-error";
import {addRequestHook} from "../helpers/add-request-hook";

export async function initUserClient() {
    const client = await initHttpClient();
    await client.post("/auth/sign-up").send(userData).expect(201);
    const response = await client.post("/auth/login").send({
        email: userData.email,
        password: userData.password,
    }).expect(201).expect(logRespError);
    const cookies = response.headers['set-cookie']
    const {accessToken} = response.body;
    addRequestHook(client, req => req.set({"Authorization": `Bearer ${accessToken}`, "User-Agent": "supertest"}).set("Cookie", cookies));
    return client;
}
