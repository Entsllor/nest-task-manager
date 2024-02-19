import type {Config} from "jest";
import * as dotenv from "dotenv";

dotenv.config({path: "../.env.test"});

export default async (): Promise<Config> => ({
    "moduleFileExtensions": [
        "js",
        "json",
        "ts",
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    "collectCoverageFrom": [
        "**/*.(t|j)s",
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "testTimeout": 100000,
    moduleDirectories: ["node_modules", "src"],
});
