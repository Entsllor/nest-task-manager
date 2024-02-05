import {Injectable} from "@nestjs/common";
import {PasswordsService} from "./passwords.service";


const prefix = "secret";

@Injectable()
export class DummyPasswordsService implements PasswordsService {
    async hash(plainTextPassword: string): Promise<string> {
        return Promise.resolve(prefix + plainTextPassword);
    }

    async check(plainTextPassword: string, passwordHash: string): Promise<boolean> {
        return Promise.resolve(prefix + plainTextPassword === passwordHash);
    }
}
