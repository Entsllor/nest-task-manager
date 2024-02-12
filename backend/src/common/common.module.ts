import {Global, Module} from "@nestjs/common";
import {SettingsModule} from "./settings/settings.module";
import {Settings} from "./settings/settings.service";
import {DbModule} from "./db/db.module";
import {ClsModule} from "nestjs-cls";
import {APP_INTERCEPTOR, APP_PIPE} from "@nestjs/core";
import {ZodSerializerInterceptor, ZodValidationPipe} from "nestjs-zod";
import {CookiesService} from "./cookies/cookies.service";

@Global()
@Module({
    imports: [SettingsModule, DbModule, ClsModule.forRoot({
        global: true,
        middleware: {
            mount: true,
        },
    })],
    exports: [Settings, ClsModule, CookiesService],
    providers: [
        Settings,
        CookiesService,
        {provide: APP_PIPE, useClass: ZodValidationPipe},
        {provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor},
    ],
})
export class CommonModule {
}
