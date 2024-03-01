import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";
import {Maybe} from "../../helpers/validation/maybe";


export const CreateTaskSchema = z.object({
    title: z.string(),
    description: Maybe(z.string()),
    deadline: Maybe(z.coerce.date().min(new Date())),
    isHighPriority: Maybe(z.coerce.boolean()),
    boardId: Maybe(z.coerce.number()),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {
}

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({});

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {
}

export const TaskSchema = CreateTaskSchema.extend({
    id: z.string().uuid(),
    authorId: z.string().uuid(),
    boardId: z.coerce.number(),
});


export class TaskDto extends createZodDto(TaskSchema) {
}