import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";


export const CreateTaskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    deadline: z.coerce.date().min(new Date()).optional(),
    isHighPriority: z.coerce.boolean().optional(),
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