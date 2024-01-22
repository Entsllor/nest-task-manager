import {Test, TestingModule} from "@nestjs/testing"
import {Settings} from "./settings.service"

describe("Settings", () => {
    let provider: Settings

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Settings],
        }).compile()

        provider = module.get<Settings>(Settings)
    })

    it("should be defined", () => {
        expect(provider).toBeDefined()
    })
})
