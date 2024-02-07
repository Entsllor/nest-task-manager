import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";
import {Optional} from "../../helpers/validation/optional";
import {
    MAX_NAMES_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_PASSWORD_LENGTH,
    MIN_USER_AGE,
    MIN_USERNAME_LENGTH,
} from "./users.const";
import {timeZoneType} from "../../helpers/validation/tz";
import {subYears} from "date-fns";

const usernameType = z.string().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH).toLowerCase().regex(new RegExp(`^[a-zA-Z0-9_.]{${MIN_USERNAME_LENGTH},${MAX_USERNAME_LENGTH}}$`));


export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
    username: usernameType,
    lastName: Optional(z.string().max(MAX_NAMES_LENGTH)),
    firstName: Optional(z.string().max(MAX_NAMES_LENGTH)),
    secondName: Optional(z.string().max(MAX_NAMES_LENGTH)),
    birthdate: Optional(
        z.date({coerce: true})
            .refine(
                arg => arg < subYears(new Date(), MIN_USER_AGE),
                `user should be at least ${MIN_USER_AGE} years old`),
    ),
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
    lastName: Optional(z.string().max(MAX_NAMES_LENGTH)),
    firstName: Optional(z.string().max(MAX_NAMES_LENGTH)),
    secondName: Optional(z.string().max(MAX_NAMES_LENGTH)),
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
}).partial();

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {
}
