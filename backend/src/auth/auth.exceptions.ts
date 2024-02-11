import {BadRequest, NotFound} from "backend-batteries";

export class UserNotFound extends NotFound {
    entityName = "user";
}


export class NotUniqueUsername extends BadRequest {

}

export class NotUniqueEmail extends BadRequest {

}

export class NotValidELoginOrPassword {

}

export class RefreshTokenRequired extends BadRequest {
    message='Cannot find refreshToken in cookies'
}