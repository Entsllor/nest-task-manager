import {Injectable} from "@nestjs/common";
import {pick} from "radash";
import {AppMode} from "./common/settings/settings.types";
import {Settings} from "./common/settings/settings.service";

@Injectable()
export class AppService {
    constructor(private readonly settings: Settings) {
        this.settings = settings;
    }

    getAppInfo(): Record<string, any> {
        if (this.settings.vars.NODE_ENV === AppMode.development) {
            return this.settings.vars;
        }
        return {...pick(this.settings.vars, ["APP_NAME"]), MODE: this.settings.vars.NODE_ENV};
    }
}
