import {Test, TestingModule} from "@nestjs/testing";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ConfigModule} from "@nestjs/config";
import {configSchema} from "./common/settings/settings.schemas";
import {Settings} from "./common/settings/settings.service";

describe("AppController", () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({validate: configSchema.parse})],
            controllers: [AppController],
            providers: [AppService, Settings],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe("root", () => {
        it("should return object with app name", () => {
            expect(appController.getAppInfo()).toHaveProperty("APP_NAME", "nestjs app");
        });
    });
});
