export async function expectError<T>(action: Promise<T>, error: Error | typeof Error | string | (new () => Error)): Promise<T> {
    return await expect(async () => await action).rejects.toThrow(error).then();
}