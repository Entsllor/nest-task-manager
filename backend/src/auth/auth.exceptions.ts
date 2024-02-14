import {BadRequest, NotFound} from "backend-batteries";

export class UserNotFound extends NotFound {
    entityName = "user";
}


export class NotUniqueUsername extends BadRequest {

}

export class NotUniqueEmail extends BadRequest {

}

export class NotValidELoginOrPassword extends BadRequest {

}

export class RefreshTokenRequired extends BadRequest {
    message = "Cannot find refreshToken in cookies";
}

export class FailedToParseClientIp extends BadRequest {
}

export class FailedToParseUserAgent extends BadRequest {
}

export class FailedToRefreshTokenForbidden extends BadRequest {
    status = 403;
}
