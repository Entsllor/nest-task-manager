import type {Config} from "jest";
import * as dotenv from "dotenv";
import baseConfig from "../jest.config";

dotenv.config({path: "../../.env.test"});

export default async (): Promise<Config> => ({
    ...await baseConfig(),
    "rootDir": ".",
    "testRegex": ".e2e-spec.ts$",
    "testTimeout": 100000,
    setupFilesAfterEnv: [
        "<rootDir>/setupTests.ts",
    ],
});
