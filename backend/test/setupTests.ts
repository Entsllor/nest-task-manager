import {INestApplication} from "@nestjs/common";
import {initTestApp} from "./fixtures/init-test-app";
import {DataSource} from "typeorm";

export let testApp: INestApplication;

beforeEach(async () => {
    testApp = await initTestApp();
    const dataSource = testApp.get(DataSource)
    const entities = dataSource.entityMetadatas;
    const tableNames = entities.map(entity => `"${entity.tableName}"`).join(", ");
    await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
});

afterEach(async () => {
        await testApp.close();
    },
);
