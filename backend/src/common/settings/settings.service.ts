import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ISettings} from "./settings.schemas";
import {keysOf} from "backend-batteries";

@Injectable()
export class Settings extends ConfigService<ISettings> {
    get vars(): ISettings {
        return this["internalConfig"]["_PROCESS_ENV_VALIDATED"];
    }

    get keys(): (keyof ISettings)[] {
        return keysOf(this.vars);
    }
}
