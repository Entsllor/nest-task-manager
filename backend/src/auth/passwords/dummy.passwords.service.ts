import {Injectable} from "@nestjs/common";

import {IPasswordsService} from "./passwords.types";


const prefix = "secret";

@Injectable()
export class DummyPasswordsService implements IPasswordsService {
    async hash(plainTextPassword: string): Promise<string> {
        return Promise.resolve(prefix + "_" + plainTextPassword);
    }

    async check(plainTextPassword: string, passwordHash: string): Promise<boolean> {
        return Promise.resolve((prefix + "_" + plainTextPassword) === passwordHash);
    }
}
