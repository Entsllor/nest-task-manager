import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";
import {RefreshToken} from "./refresh-tokens.enity";
import {Maybe} from "../../helpers/validation/maybe";

const RefreshTokenSchema = z.object({
    body: z.string().max(31),
    userId: z.string().uuid(),
    createdAt: z.coerce.date(),
    revokedAt: Maybe(z.coerce.date()),
    expireAt: z.coerce.date(),
    authorIp: z.string().ip("v4"),
    userAgent: z.string().max(255),
});

export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) implements Omit<RefreshToken, "user"> {
}

const CreateRefreshTokenSchema = RefreshTokenSchema.pick({userId: true, authorIp: true, userAgent: true});

export class CreateRefreshTokenDto extends createZodDto(CreateRefreshTokenSchema) {
}