import {CallbackHandler, SuperTest, Test} from "supertest";
import TestAgent from "supertest/lib/agent";

export function addRequestHook(client: SuperTest | TestAgent, hook: (req: Test) => Test) {
    // decorates each http method with custom hooks
    for (const methodName of ["post", "get", "delete", "put", "head", "options"] as const) {
        const method = client[methodName];
        client[methodName] = (url: string, callback: CallbackHandler) => hook(method(url, callback));
    }
}