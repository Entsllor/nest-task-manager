import {Controller, Get} from "@nestjs/common";
import {AppService} from "./app.service";
import {OpenApiSettings} from "./helpers/decorators/open-api-settings";
import {Public} from "./auth/decorators/public.decorator";

@OpenApiSettings("default", {auth: "public"})
@Controller()
export class AppController {
    constructor(private appService: AppService) {
    }

    @Get()
    @Public()
    getAppInfo(): Record<string, any> {
        return this.appService.getAppInfo();
    }
}
