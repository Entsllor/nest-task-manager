import {Injectable} from "@nestjs/common";
import {KeyValueStorage} from "../../common/key-value-storage/key-value-storage.service";
import {Settings} from "../../common/settings/settings.service";

@Injectable()
export class JwtBlockList {
    constructor(private storage: KeyValueStorage, private settings: Settings) {
    }

    async set(jwt: string) {
        return this.storage.set(`jwt-${jwt}`, "blocked", this.settings.vars.JWT_LIFETIME_IN_MINUTES * 60);
    }

    async has(jwt: string) {
        return this.storage.has(`jwt-${jwt}`);
    }
}