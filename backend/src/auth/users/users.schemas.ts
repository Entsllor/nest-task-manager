import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";
import {Maybe} from "../../helpers/validation/maybe";
import {
    MAX_NAMES_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
} from "./users.const";
import {timeZoneType} from "../../helpers/validation/tz";

const usernameType = z.string().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH).toLowerCase().regex(new RegExp(`^[a-zA-Z0-9_.]{${MIN_USERNAME_LENGTH},${MAX_USERNAME_LENGTH}}$`));


export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
    username: usernameType,
    lastName: Maybe(z.string().max(MAX_NAMES_LENGTH)),
    firstName: Maybe(z.string().max(MAX_NAMES_LENGTH)),
    secondName: Maybe(z.string().max(MAX_NAMES_LENGTH)),
    birthdate: Maybe(z.coerce.date()),
    timezone: Maybe(timeZoneType),
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
    lastName: Maybe(z.string().max(MAX_NAMES_LENGTH)),
    firstName: Maybe(z.string().max(MAX_NAMES_LENGTH)),
    secondName: Maybe(z.string().max(MAX_NAMES_LENGTH)),
    createdAt: z.coerce.date(),
});

export class PublicUserDto extends createZodDto(PublicUserSchema) {
}

export const PrivateUserSchema = PublicUserSchema.extend({
    email: z.string(),
    updatedAt: z.coerce.date(),
    timezone: Maybe(timeZoneType),
});

export class PrivateUserDto extends createZodDto(PrivateUserSchema) {

}

const UpdateUserSchema = PrivateUserSchema.pick({
    secondName: true,
    firstName: true,
    lastName: true,
    timezone: true,
}).partial();

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {
}
