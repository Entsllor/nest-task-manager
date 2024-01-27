import {Test, TestingModule} from "@nestjs/testing";
import {INestApplication} from "@nestjs/common";
import * as request from "supertest";
import {AppModule} from "../src/app.module";
import {CommonModule} from "../src/common/common.module";
import {Settings} from "../src/common/settings/settings.service";

describe("AppController (e2e)", () => {
    let app: INestApplication;
    let settings: Settings;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, CommonModule],
        }).compile();
        settings = moduleFixture.get(Settings);
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer()).get("/").expect(200).expect({
            APP_NAME: settings.vars.APP_NAME,
            MODE: "test",
        });
    });
});
