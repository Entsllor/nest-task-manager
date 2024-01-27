import {NotFound} from "backend-batteries";

export class TaskNotFound extends NotFound {
    entityName = "task";
}