import {Injectable} from "@nestjs/common";
import {compare, hash} from "bcrypt";

const DEFAULT_SALT_OR_ROUNDS = 12;

@Injectable()
export class PasswordsService {
    async hash(plainTextPassword: string): Promise<string> {
        return hash(plainTextPassword, DEFAULT_SALT_OR_ROUNDS);
    }

    async check(plainTextPassword: string, passwordHash: string): Promise<boolean> {
        return await compare(plainTextPassword, passwordHash);
    }
}
