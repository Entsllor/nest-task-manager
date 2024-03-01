import {Global, Module} from "@nestjs/common";
import {SettingsModule} from "./settings/settings.module";
import {Settings} from "./settings/settings.service";
import {DbModule} from "./db/db.module";
import {ClsModule} from "nestjs-cls";
import {APP_INTERCEPTOR, APP_PIPE} from "@nestjs/core";
import {ZodSerializerInterceptor, ZodValidationPipe} from "nestjs-zod";
import {CookiesService} from "./cookies/cookies.service";
import {KeyValueStorageModule} from "./key-value-storage/key-value-storage.module";
import {KeyValueStorage} from "./key-value-storage/key-value-storage.service";


@Global()
@Module({
    imports: [
        SettingsModule,
        DbModule,
        ClsModule.forRoot({global: true, middleware: {mount: true}}),
        KeyValueStorageModule,
    ],
    exports: [Settings, ClsModule, CookiesService, KeyValueStorage],
    providers: [
        Settings,
        CookiesService,
        KeyValueStorage,
        {provide: APP_PIPE, useClass: ZodValidationPipe},
        {provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor},
    ],
})
export class CommonModule {
}
