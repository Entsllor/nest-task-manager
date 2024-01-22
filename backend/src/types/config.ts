import zod from "zod";

export enum AppMode {
    development = "development",
    production = "production",
    test = "test",
}

export const configSchema = zod.object({
    NODE_ENV: zod.nativeEnum(AppMode),
    PORT: zod.number({coerce: true}).default(3000),
    APP_NAME: zod.string().default("nestjs app"),
});

export type ISettings = zod.TypeOf<typeof configSchema>
