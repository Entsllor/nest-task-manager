import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";


@Injectable()
export class KeyValueStorage {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    async has(key: string) {
        return this.cacheManager.get(key).then(Boolean);
    }

    async get(key: string) {
        return this.cacheManager.get(key);
    }

    async del(key: string) {
        return this.cacheManager.del(key);
    }

    async set(key: string, value: unknown, ttlInSeconds?: number) {
        await this.cacheManager.set(key, value, ttlInSeconds ? ttlInSeconds * 1000 : undefined!);
    }
}