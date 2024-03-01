import {NotFound} from "backend-batteries";

export class TaskNotFound extends NotFound {
    entityName = "task";
}
export class BoardNotFound extends NotFound {
    entityName = "task";
}