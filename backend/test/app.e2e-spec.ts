import {INestApplication} from "@nestjs/common";
import * as request from "supertest";
import {Settings} from "../src/common/settings/settings.service";
import {initTestApp} from "./fixtures/init-test-app";


describe("AppController (e2e)", () => {
    let app: INestApplication;
    let settings: Settings;

    beforeEach(async () => {
        app = await initTestApp();
        settings = app.get(Settings);
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer()).get("/").expect(200).expect({
            APP_NAME: settings.vars.APP_NAME,
            MODE: "test",
        });
    });
});
