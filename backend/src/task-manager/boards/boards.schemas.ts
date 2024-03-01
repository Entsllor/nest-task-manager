import {z} from "nestjs-zod/z";
import {MAX_BOARD_DESCRIPTION_LENGTH, MAX_BOARD_NAME_LENGTH} from "./boards.entity";
import {Maybe} from "../../helpers/validation/maybe";
import {createZodDto} from "nestjs-zod";

const CreateBoardSchema = z.object({
    name: z.string().max(MAX_BOARD_NAME_LENGTH),
    description: Maybe(z.string().max(MAX_BOARD_DESCRIPTION_LENGTH)),
    teamId: Maybe(z.number()),
});

export class CreateBoardDto extends createZodDto(CreateBoardSchema) {
}

const UpdateBoardSchema = CreateBoardSchema.partial().omit({teamId: true});

export class UpdateBoardDto extends createZodDto(UpdateBoardSchema) {
}

export const BoardSchema = CreateBoardSchema.extend({
    id: z.number(),
    authorId: Maybe(z.string().uuid()),
});

export class BoardDto extends createZodDto(BoardSchema) {
}
