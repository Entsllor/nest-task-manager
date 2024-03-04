import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";

const CreateTeamMemberSchema = z.object({
    teamId: z.number().int(),
    userId: z.string().uuid(),
});

export class CreateTeamMemberDto extends createZodDto(CreateTeamMemberSchema) {
}

const TeamMemberSchema = CreateTeamMemberSchema.extend({});

export class IdentityTeamMemberDto extends createZodDto(TeamMemberSchema) {

}

export class TeamMemberDto extends createZodDto(TeamMemberSchema) {
}
