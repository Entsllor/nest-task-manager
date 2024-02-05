import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";
import zod from "zod";

const usernameType = z.string().min(5).toLowerCase().regex(/^[a-zA-Z0-9_.]+$/);
const tzType = Intl.supportedValuesOf("timeZone") as [string, ...string[]];

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.password().min(8).max(63),
    username: usernameType,
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    secondName: z.string().optional(),
    birthdate: z.date({coerce: true}).min(new Date("1900-01-01")).optional(),
    timezone: z.enum(tzType).optional(),
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
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    secondName: z.string().optional(),
    createdAt: z.date(),
});

export class PublicUserDto extends createZodDto(PublicUserSchema) {
}

export const PrivateUserSchema = PublicUserSchema.extend({
    email: z.string(),
    updatedAt: z.coerce.date(),
});

export class PrivateUserDto extends createZodDto(PrivateUserSchema) {
}

const UpdateUserSchema = zod.object({});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {
}