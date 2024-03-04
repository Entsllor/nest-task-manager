import {Factories} from "./helpers/factory";
import {DataSource} from "typeorm";
import {INestApplication} from "@nestjs/common";
import {TestingModule} from "@nestjs/testing";
import {Task} from "../src/task-manager/tasks/tasks.entity";
import {faker} from "@faker-js/faker";
import {User} from "../src/auth/users/users.entity";
import {userData} from "./fixtures/test-consts";
import {Team} from "../src/teams/teams.entity";
import {Board} from "../src/task-manager/boards/boards.entity";
import {PasswordsService} from "../src/auth/passwords/passwords.service";
import {TeamMember} from "../src/teams/team-members/team-members.entity";


export async function initFactories(app: INestApplication | TestingModule) {
    const factories = new Factories(app.get(DataSource));
    const userFactory = factories.registerFactory(User, {
        username: () => faker.internet.userName(),
        email: () => faker.internet.email(),
        password: async () => await (app.get(PasswordsService).hash(userData.password)),
    });
    const teamFactory = factories.registerFactory(Team, {
        name: () => faker.word.words(1),
        author: userFactory,
    });

    factories.registerFactory(TeamMember, {
        team: teamFactory,
        user: userFactory,
    });

    const boardFactory = factories.registerFactory(Board, {
        author: userFactory,
        name: () => faker.word.words(1),
        team: data => teamFactory.create({author: data.author}),
    });
    factories.registerFactory(Task, {
        author: userFactory,
        title: () => faker.word.words(3),
        description: () => faker.word.words(10),
        deadline: () => faker.date.future(),
        board: data => boardFactory.create({author: data.author}),
    });
    return factories;
}