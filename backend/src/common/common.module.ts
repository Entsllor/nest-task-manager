import {Global, Module} from "@nestjs/common";
import {SettingsModule} from "./settings/settings.module";
import {Settings} from "./settings/settings.service";
import {DbModule} from "./db/db.module";
import {ClsModule} from "nestjs-cls";

@Global()
@Module({
    imports: [SettingsModule, DbModule, ClsModule.forRoot({
        global: true,
        middleware: {
            mount: true,
        },
    })],
    exports: [Settings, ClsModule],
    providers: [Settings],
})
export class CommonModule {
}
