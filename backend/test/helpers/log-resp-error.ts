import {Response} from "supertest";

export function logRespError(response: Response) {
    if (response.status >= 400) {
        console.log(response.body, response.status);
    }
}
