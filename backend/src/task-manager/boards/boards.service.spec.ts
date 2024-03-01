import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import {BoardsRepository} from "./boards.repository";
import {CommonModule} from "../../common/common.module";
import {TeamsModule} from "../../teams/teams.module";
import {TeamsService} from "../../teams/teams.service";

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardsRepository, BoardsService, TeamsService],
      imports: [CommonModule, TeamsModule],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
