import {Test, TestingModule} from "@nestjs/testing";
import {TeamsService} from "./teams.service";
import {TeamsRepository} from "./teams.repository";
import {CommonModule} from "../common/common.module";
import {TeamMembersModule} from "./team-members/team-members.module";

describe("TeamsService", () => {
    let service: TeamsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TeamsService, TeamsRepository],
            imports: [CommonModule, TeamMembersModule],
        }).compile();

        service = module.get<TeamsService>(TeamsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
