import zod from "zod";

export enum AppMode {
    development = "development",
    production = "production",
    test = "test",
}

// todo delete zod
export const configSchema = zod.object({
    NODE_ENV: zod.nativeEnum(AppMode),
    PORT: zod.coerce.number().default(3000),
    APP_VERSION: zod.string().default("1.0"),
    APP_NAME: zod.string().default("nestjs app"),
    SWAGGER_URL_PREFIX: zod.string().regex(/^[\/0-9a-zA-Z\-_]+$/).default("swagger"),

    DB_TYPE: zod.string(),
    DB_NAME: zod.string(),
    DB_HOST: zod.string(),
    DB_PORT: zod.coerce.number(),
    DB_USER: zod.string(),
    DB_PASSWORD: zod.string(),
    DB_LOGGING: zod.coerce.boolean().default(false),
});

export type ISettings = zod.TypeOf<typeof configSchema>
