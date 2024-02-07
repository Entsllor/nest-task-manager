import {z} from "nestjs-zod/z";

const timeZones = Intl.supportedValuesOf("timeZone") as [string, ...string[]];
export const timeZoneType = z.enum(timeZones);
