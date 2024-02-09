import {initTestModule} from "./init-test-module";
import * as request from "supertest";
import {INestApplication} from "@nestjs/common";

export async function initHttpClient(app?: INestApplication) {
    app = app ?? await initTestModule();
    return request(app.getHttpServer());
}