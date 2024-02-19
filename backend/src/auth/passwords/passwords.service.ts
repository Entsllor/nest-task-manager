import {Injectable} from "@nestjs/common";
import {compare, hash} from "bcrypt";
import {IPasswordsService} from "./passwords.types";
import {Settings} from "../../common/settings/settings.service";


@Injectable()
export class PasswordsService implements IPasswordsService {
    constructor(private settings: Settings) {
    }

    async hash(plainTextPassword: string) {
        return hash(plainTextPassword, this.settings.vars.PASSWORD_SALT_OR_ROUNDS);
    }

    async check(plainTextPassword: string, passwordHash: string) {
        return compare(plainTextPassword, passwordHash);
    }
}
