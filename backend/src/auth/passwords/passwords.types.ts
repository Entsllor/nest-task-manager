export interface IPasswordsService {
    hash(plainTextPassword: string): Promise<string>;

    check(plainTextPassword: string, passwordHash: string): Promise<boolean>;
}
