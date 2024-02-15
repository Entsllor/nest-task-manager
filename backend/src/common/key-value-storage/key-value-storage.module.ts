import {Module} from "@nestjs/common";
import {Settings} from "../settings/settings.service";
import {redisStore} from "cache-manager-redis-yet";
import {CacheModule} from "@nestjs/cache-manager";
import {KeyValueStorage} from "./key-value-storage.service";

@Module({
    imports: [
        CacheModule.registerAsync({
            inject: [Settings],
            isGlobal: true,
            useFactory: async (settings: Settings) => ({
                store: await redisStore({database: settings.vars.REDIS_DB}),
                host: settings.vars.REDIS_HOST,
                port: settings.vars.REDIS_PORT,
            }),
        }),
    ],
    providers: [KeyValueStorage],
    exports: [KeyValueStorage],
})
export class KeyValueStorageModule {
}
