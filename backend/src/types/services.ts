import {TypeOf} from "zod"
import {configSchema} from "./config"
import {ConfigService} from "@nestjs/config"

export type AppConfig = ConfigService<TypeOf<typeof configSchema>>
