import {Controller, Get} from "@nestjs/common";
import {AppService} from "./app.service";
import {OpenApiSettings} from "./helpers/decorators/open-api-settings";

@OpenApiSettings('default', {auth: 'public'})
@Controller()
export class AppController {
    constructor(private appService: AppService) {
    }

    @Get()
    getAppInfo(): Record<string, any> {
        return this.appService.getAppInfo();
    }
}
