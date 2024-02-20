import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";
import {Maybe} from "../helpers/validation/maybe";

const CreateTeamSchema = z.object({name: z.string(), description: Maybe(z.string())});

export class CreateTeamDto extends createZodDto(CreateTeamSchema) {
}

const UpdateTeamSchema = CreateTeamSchema.partial();

export class UpdateTeamDto extends createZodDto(UpdateTeamSchema) {
}

const TeamSchema = CreateTeamSchema.extend({id: z.number(), createdAt: z.date(), authorId: Maybe(z.string().uuid())});

export class TeamDto extends createZodDto(TeamSchema) {
}
