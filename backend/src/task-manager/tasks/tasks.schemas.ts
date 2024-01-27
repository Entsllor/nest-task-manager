import {z} from "nestjs-zod/z";
import {createZodDto} from "nestjs-zod";


export const CreateTaskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    deadline: z.dateString().future().optional(),
    isHighPriority: z.boolean().optional(),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {
}

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({});

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {
}

export const TaskSchema = CreateTaskSchema.extend({id: z.string().uuid()});

export class TaskDto extends createZodDto(TaskSchema) {
}