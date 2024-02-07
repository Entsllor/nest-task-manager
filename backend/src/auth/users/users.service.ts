import {Injectable} from "@nestjs/common";
import {UsersRepository} from "./users.repository";
import {SignupDto} from "./users.schemas";
import {raise, UUID} from "backend-batteries";
import {NotUniqueEmail, NotUniqueUsername} from "../auth.exceptions";
import {DeepPartial} from "typeorm";
import {User} from "./users.model";
import {PasswordsService} from "../passwords/passwords.service";

@Injectable()
export class UsersService {
    constructor(private readonly passwordsService: PasswordsService, private repo: UsersRepository) {
    }

    async signup(signupDto: SignupDto) {
        const duplicatedUser = await this.repo.getByEmailOrUsername(signupDto.email, signupDto.username);
        if (duplicatedUser) {
            if (duplicatedUser.email === signupDto.email) {
                raise(NotUniqueEmail);
            }
            raise(NotUniqueUsername);
        }
        return this.repo.create({...signupDto, password: await this.passwordsService.hash(signupDto.password)});
    }

    findAll() {
        return this.repo.findMany();
    }

    findOne(id: UUID) {
        return this.repo.getById(id);
    }

    update(id: UUID, data: DeepPartial<User>) {
        return this.repo.updateOne({id}, data);
    }
}
