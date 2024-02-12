import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";
import {Maybe} from "../../helpers/validation/maybe";


export const CreateTaskSchema = z.object({
    title: z.string(),
    description: Maybe(z.string()),
    deadline: Maybe(z.coerce.date().min(new Date())),
    isHighPriority: Maybe(z.coerce.boolean()),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {
}

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({});

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {
}

export const TaskSchema = CreateTaskSchema.extend({id: z.string().uuid()});

export class TaskSearchDto extends createZodDto(TaskSchema.partial()) {
}

export class TaskDto extends createZodDto(TaskSchema) {
}