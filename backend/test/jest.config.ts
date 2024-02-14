import type {Config} from "jest";
import * as dotenv from "dotenv";

dotenv.config({path: "../../.env.test"});

export default async (): Promise<Config> => ({
    "moduleFileExtensions": [
        "js",
        "json",
        "ts",
    ],
    "rootDir": ".",
    "testRegex": ".e2e-spec.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    "collectCoverageFrom": [
        "**/*.(t|j)s",
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "testTimeout": 100000,
    setupFilesAfterEnv: [
        "<rootDir>/setupTests.ts"
    ]
});
