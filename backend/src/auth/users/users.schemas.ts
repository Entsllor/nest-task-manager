import {z, ZodOptional, ZodType} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";

const usernameType = z.string().min(5).toLowerCase().regex(/^[a-zA-Z0-9_.]+$/);
const timeZones = Intl.supportedValuesOf("timeZone") as [string, ...string[]];
const timeZoneType = z.enum(timeZones);

function Optional<T extends ZodType>(t: T): ZodOptional<T> {
    return t.nullable().optional().transform(arg => arg ?? undefined) as any;
}


export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.password().min(8).max(63),
    username: usernameType,
    lastName: Optional(z.string()),
    firstName: Optional(z.string()),
    secondName: Optional(z.string()),
    birthdate: Optional(z.date({coerce: true}).min(new Date("1900-01-01"))),
    timezone: Optional(timeZoneType),
});

export class SignupDto extends createZodDto(SignupSchema) {
}

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export class LoginDto extends createZodDto(LoginSchema) {
}


export const PublicUserSchema = z.object({
    id: z.string().uuid(),
    username: usernameType,
    lastName: Optional(z.string()),
    firstName: Optional(z.string()),
    secondName: Optional(z.string()),
    createdAt: z.date(),
});

export class PublicUserDto extends createZodDto(PublicUserSchema) {
}

export const PrivateUserSchema = PublicUserSchema.extend({
    email: z.string(),
    updatedAt: z.coerce.date(),
    timezone: Optional(timeZoneType),
});

export class PrivateUserDto extends createZodDto(PrivateUserSchema) {

}

const UpdateUserSchema = PrivateUserSchema.pick({
    secondName: true,
    firstName: true,
    lastName: true,
    timezone: true,
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {
}