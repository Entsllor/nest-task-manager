import {Test, TestingModule} from "@nestjs/testing";
import {Settings} from "./settings.service";

describe("SettingsService", () => {
    let service: Settings;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Settings],
        }).compile();

        service = module.get<Settings>(Settings);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
