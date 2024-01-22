import {Module} from "@nestjs/common";
import {SettingsModule} from "./settings/settings.module";
import {Settings} from "./settings/settings.service";

@Module({
    imports: [SettingsModule],
    exports: [Settings],
    providers: [Settings],
})
export class CommonModule {
}
