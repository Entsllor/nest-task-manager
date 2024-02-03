import {CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope} from "@nestjs/common";
import {catchError, concatMap, finalize, Observable} from "rxjs";
import {DataSource} from "typeorm";
import {ClsService} from "nestjs-cls";

export const QUERY_MANAGER_KEY = "QUERY_MANAGER";

@Injectable({scope: Scope.REQUEST})
export class TransactionsInterceptor implements NestInterceptor {
    constructor(private dataSource: DataSource, private cls: ClsService) {
    }

    async intercept(_context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        this.cls.set(QUERY_MANAGER_KEY, queryRunner.manager);
        return next.handle().pipe(
            concatMap(async (data) => {
                await queryRunner.commitTransaction();
                return data;
            }),
            catchError(async (e) => {
                await queryRunner.rollbackTransaction();
                throw e;
            }),
            finalize(async () => {
                if (!queryRunner.isReleased) {
                    await queryRunner.release();
                }
            }),
        );
    }
}