export async function expectError<T>(action: Promise<T> | T, error: Error | typeof Error | string): Promise<T> {
    // await expect(async () => await controller.getOne(uuid4())).rejects.toThrow(new TaskNotFound);
    return await expect(async () => await action).rejects.toThrow(error).then();
}