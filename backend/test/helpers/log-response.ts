import {Response} from "supertest";

export function logResponse(response: Response) {
    console.log(response.body, response.status);
}
