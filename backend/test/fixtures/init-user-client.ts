import {initHttpClient} from "./init-http-client";
import {userData} from "./test-consts";
import {addRequestHook} from "../helpers/add-request-hook";
import {getTestUser} from "../setupTests";

export async function initUserClient() {
    const client = await initHttpClient();
    const user = await getTestUser();
    const response = await client.post("/auth/login").send({
        email: user.email,
        password: userData.password,
    }).expect(201);
    const cookies = response.headers["set-cookie"];
    const {accessToken} = response.body;
    addRequestHook(client, req => req.set({
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "supertest",
    }).set("Cookie", cookies));
    return client;
}
