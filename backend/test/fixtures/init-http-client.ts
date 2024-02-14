import * as request from "supertest";
import {SuperTest} from "supertest";
import {testApp} from "../setupTests";

export async function initHttpClient(): Promise<SuperTest> {
    return request(testApp.getHttpServer()) as any;
}
