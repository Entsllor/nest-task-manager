import {Global, Module} from "@nestjs/common";
import {SettingsModule} from "./settings/settings.module";
import {Settings} from "./settings/settings.service";
import {DbModule} from "./db/db.module";
import {ClsModule} from "nestjs-cls";
import {APP_INTERCEPTOR, APP_PIPE} from "@nestjs/core";
import {ZodSerializerInterceptor, ZodValidationPipe} from "nestjs-zod";

@Global()
@Module({
    imports: [SettingsModule, DbModule, ClsModule.forRoot({
        global: true,
        middleware: {
            mount: true,
        },
    })],
    exports: [Settings, ClsModule],
    providers: [
        Settings,
        {provide: APP_PIPE, useClass: ZodValidationPipe},
        {provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor},
    ],
})
export class CommonModule {
}
