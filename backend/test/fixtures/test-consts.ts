import {generateMock} from "@anatine/zod-mock";
import {SignupSchema} from "../../src/auth/users/users.schemas";

export const userData = generateMock(SignupSchema);
