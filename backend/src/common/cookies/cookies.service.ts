import {Inject, Injectable} from "@nestjs/common";
import {HttpAdapterHost, REQUEST} from "@nestjs/core";
import {RefreshToken} from "../../auth/refresh-tokens/refresh-tokens.model";
import {IRequest} from "../../helpers/types/util-types";

@Injectable()
export class CookiesService {
    constructor(private httpAdapter: HttpAdapterHost, @Inject(REQUEST) private req: IRequest) {
    }

    setRefreshToken(refreshToken: RefreshToken): void {
        this.httpAdapter.httpAdapter.setHeader(
            this.req.res,
            "Set-Cookie",
            `refreshToken=${refreshToken.body}; Expires=${refreshToken.expireAt}; Path=/auth/; Secure; SameSite=Strict; HttpOnly`,
        );
    }

    unsetRefreshToken(): void {
        this.httpAdapter.httpAdapter.setHeader(
            this.req.res,
            "Set-Cookie",
            `refreshToken=undefined; Expires=${new Date(0)}; Path=/auth/; Secure; SameSite=Strict; HttpOnly`,
        );
    }
}