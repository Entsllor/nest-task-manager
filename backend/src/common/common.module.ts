import {Global, Module} from "@nestjs/common";
import {SettingsModule} from "./settings/settings.module";
import {Settings} from "./settings/settings.service";
import {DbModule} from "./db/db.module";

@Global()
@Module({
    imports: [SettingsModule, DbModule],
    exports: [Settings],
    providers: [Settings],
})
export class CommonModule {
}
