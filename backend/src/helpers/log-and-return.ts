export function logAndReturn<T>(x: T): T {
    console.log(x);
    return x
}