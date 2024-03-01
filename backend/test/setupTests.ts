import {INestApplication} from "@nestjs/common";
import {initTestApp} from "./fixtures/init-test-app";
import {DataSource} from "typeorm";
import {User} from "auth/users/users.entity";
import {Factories} from "./helpers/factory";
import {initFactories} from "./factories";
import {userData} from "./fixtures/test-consts";
import {omit} from "radash";

export let testApp: INestApplication;
export let testUser: User;
export let factories: Factories;

beforeEach(async () => {
    testApp = await initTestApp();
    factories = await initFactories(testApp);
    const dataSource = testApp.get(DataSource);
    const entities = dataSource.entityMetadatas;
    const tableNames = entities.map(entity => `"${entity.tableName}"`).join(", ");
    await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
});

export async function getTestUser(): Promise<User> {
    if (!testUser) {
        testUser = await factories.get(User).create(omit(userData, ["password"]));
    }
    return testUser;
}

afterEach(async () => {
        await testApp.close();
        testApp = undefined as never;
        testUser = undefined as never;
        factories = undefined as never;
    },
);
