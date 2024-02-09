import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";

export async function initTestModule() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
}