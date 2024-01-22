import {Controller, Get} from "@nestjs/common";
import {AppService} from "./app.service";

@Controller()
export class AppController {
    constructor(private appService: AppService) {
    }

    @Get()
    getAppInfo(): Record<string, any> {
        return this.appService.getAppInfo();
    }
}
