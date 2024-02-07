import {Injectable} from "@nestjs/common";
import {compare, hash} from "bcrypt";
import {IPasswordsService} from "./passwords.types";

const DEFAULT_SALT_OR_ROUNDS = 12;

@Injectable()
export class PasswordsService implements IPasswordsService {
    async hash(plainTextPassword: string) {
        return hash(plainTextPassword, DEFAULT_SALT_OR_ROUNDS);
    }

    async check(plainTextPassword: string, passwordHash: string) {
        return compare(plainTextPassword, passwordHash);
    }
}
