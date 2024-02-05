import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {UsersRepository} from "./users.repository";
import {PasswordsService} from "../passwords/passwords.service";
import {DummyPasswordsService} from "../passwords/dummy.passwords.service";
import {CommonModule} from "../../common/common.module";

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository, {provide: PasswordsService, useClass: DummyPasswordsService}],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
