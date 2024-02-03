import {DataSource, DeepPartial, EntityManager, EntityTarget, ObjectLiteral, Repository} from "typeorm";
import {ClsService} from "nestjs-cls";
import {QUERY_MANAGER_KEY} from "../../common/db/db.transactions.interceptor";

export abstract class BaseRepository<T extends ObjectLiteral> {
    abstract model: EntityTarget<T>;
    readonly idFieldName = "id";

    constructor(private dataSource: DataSource, private cls: ClsService) {
    }

    private initRepo(): Repository<T> {
        return ((this.cls?.get(QUERY_MANAGER_KEY) as EntityManager | undefined) ?? this.dataSource).getRepository(this.model);
    }

    private get repo(): Repository<T> {
        return this.initRepo();
    }

    first(criteria?: DeepPartial<T>) {
        return this.repo.findOneBy(criteria ?? {});
    }

    findMany(criteria?: DeepPartial<T>) {
        return this.repo.findBy(criteria ?? {});
    }

    create(entityData: DeepPartial<T>) {
        const entity = this.repo.create(entityData);
        return this.repo.save(entity);
    }

    async updateOne(filters: DeepPartial<T>, values: DeepPartial<T>) {
        const entity = await this.repo.findOneBy(filters);
        if (!entity) {
            return undefined;
        }
        let ids = this.repo.getId(entity);
        if (typeof ids !== "object") {
            ids = {[this.idFieldName]: ids};
        }
        return {...entity, ...await this.repo.save({...ids, ...values})};
    }

    async updateMany(filters: DeepPartial<T>, values: DeepPartial<T>) {
        return await this.repo.update(filters, values).then(value => value.affected);
    }

    async delete(filters: DeepPartial<T>) {
        return await this.repo.delete(filters).then(value => value.affected ?? 0);
    }
}
