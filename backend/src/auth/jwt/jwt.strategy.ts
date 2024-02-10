import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Settings} from "../../common/settings/settings.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(settings: Settings) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: settings.vars.JWT_SECRET_KEY,
        });
    }

    async validate(payload: any) {
        return {...payload};
    }
}
