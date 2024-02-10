import {Injectable} from "@nestjs/common";

@Injectable()
export class RefreshTokensService {
    create(): Promise<string> {
        return Promise.resolve("some-random-refresh-token");
    }
}
