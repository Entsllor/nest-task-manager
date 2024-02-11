import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Settings} from "../../common/settings/settings.service";

@Injectable()
export class ExpiredJwtStrategy extends PassportStrategy(Strategy, 'expired-jwt') {
    constructor(settings: Settings) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: settings.vars.JWT_SECRET_KEY,
        });
    }
    async validate(payload: any) {
        return {...payload};
    }
}
