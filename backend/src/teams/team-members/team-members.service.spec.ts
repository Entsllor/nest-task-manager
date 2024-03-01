import {Test, TestingModule} from "@nestjs/testing";
import {TeamMembersService} from "./team-members.service";
import {TeamMembersRepository} from "./team-members.repository";
import {CommonModule} from "../../common/common.module";

describe("TeamMembersService", () => {
    let service: TeamMembersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TeamMembersService, TeamMembersRepository],
            imports: [CommonModule],
        }).compile();

        service = module.get<TeamMembersService>(TeamMembersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
