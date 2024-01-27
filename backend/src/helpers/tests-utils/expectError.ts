export async function expectError(action: Promise<any> | any, error: Error | typeof Error | string) {
    // await expect(async () => await controller.getOne(uuid4())).rejects.toThrow(new TaskNotFound);
    await expect(async () => await action).rejects.toThrow(error)
}