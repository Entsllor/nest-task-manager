import {Module} from "@nestjs/common";
import {RefreshTokensService} from "./refresh-tokens.service";
import {RefreshTokensRepository} from "./refresh-tokens.repository";

@Module({
    providers: [RefreshTokensRepository, RefreshTokensService],
    exports: [RefreshTokensService],
})
export class RefreshTokensModule {
}
