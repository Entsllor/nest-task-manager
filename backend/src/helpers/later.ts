export function later<T>(data: T): Promise<T> {
    return Promise.resolve(data)
}