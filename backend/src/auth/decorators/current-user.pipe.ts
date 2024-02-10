import {
    createParamDecorator,
    ExecutionContext,
    Injectable,
    PipeTransform,
    UnauthorizedException,
} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {Request} from "express";
import {raise} from "backend-batteries";
import {UserNotFound} from "../auth.exceptions";

@Injectable()
export class CurrentUserPipe implements PipeTransform {
    constructor(private usersService: UsersService) {
    }

    async transform(value: string | undefined) {
        if (!value) {
            raise(UnauthorizedException);
        }
        return await this.usersService.findOne(value) || raise(UserNotFound);
    }
}

export const Decorator = createParamDecorator((data: unknown, input: ExecutionContext) => {
    const req: Request = input.switchToHttp().getRequest();
    return (req.user as any)?.sub;
});

export const CurrentUser = () => Decorator({}, CurrentUserPipe);
