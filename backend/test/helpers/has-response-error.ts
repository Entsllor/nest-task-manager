import type {Response} from "supertest";

export function hasResponseError<T extends {name: string}>(error: (new () => T) | T) {
    return (res: Response) => {
        if (!res.body) {
            throw new Error("Invalid body");
        }
        if (typeof error === "function") {
            error = new (error)() as T;
        }
        const message = error.name;
        expect(message).toBe(res.body.error);
    };
}
