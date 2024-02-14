import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";
import {Settings} from "../../src/common/settings/settings.service";

import {prepareApp} from "../../src/app.prepare";

export async function initTestApp() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    const app = moduleFixture.createNestApplication();
    const settings = app.get(Settings).vars;
    await prepareApp(app, settings, {withSwagger: false});
    await app.init();
    return app;
}