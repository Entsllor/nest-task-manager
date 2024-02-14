import type {Response} from "supertest";

export function hasResponseError<T extends {toJSON?: () => any, name?: string}>(error: T | (new () => T)) {
    return (res: Response) => {
        if (!res.body) {
            throw new Error("Invalid body");
        }
        if (typeof error === "function") {
            error = new (error)() as T;
        }
        const message = error?.toJSON?.().error ?? error.name;
        expect(message).toBe(res.body.error);
    };
}
