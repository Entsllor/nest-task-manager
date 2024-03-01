export type PrimaryKeyMetadata = {__isPk?: true}
type ForeignKeyMetadata = {__isFk?: true}
export type Pk<T> = T & PrimaryKeyMetadata

export type ForeignKey<T, K extends keyof T> =
    T[K]
    & ForeignKeyMetadata

// @ts-expect-error force pass "id"
export type ForeignId<T> = ForeignKey<T, "id">;

type NotEmptyObject<T> = T extends Record<any, never> ? never : T
export type PrimaryKeysOf<T> = {
    [K in keyof T as T[K] extends PrimaryKeyMetadata & {__isFk?: never} ? K : never]: T[K]
}
export type IdsOr<T> = NotEmptyObject<PrimaryKeysOf<T>> | T
