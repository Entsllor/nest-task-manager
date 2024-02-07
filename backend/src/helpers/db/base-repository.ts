import {DataSource, DeepPartial, EntityManager, EntityTarget, ObjectLiteral, Repository} from "typeorm";
import {ClsService} from "nestjs-cls";
import {QUERY_MANAGER_KEY} from "../../common/db/db.transactions.interceptor";

export abstract class BaseRepository<Entity extends ObjectLiteral> {
    abstract model: EntityTarget<Entity>;
    readonly idFieldName = "id";


    constructor(private dataSource: DataSource, private cls: ClsService) {
    }

    abstract getById(id: any, ...extraPrimaryKeys: any[]): Promise<Entity | null>

    private initRepo(): Repository<Entity> {
        return ((this.cls?.get(QUERY_MANAGER_KEY) as EntityManager | undefined) ?? this.dataSource).getRepository(this.model);
    }

    protected get repo(): Repository<Entity> {
        return this.initRepo();
    }

    first(criteria?: DeepPartial<Entity>) {
        return this.repo.findOneBy(criteria ?? {});
    }

    findMany(criteria?: DeepPartial<Entity>) {
        return this.repo.findBy(criteria ?? {});
    }

    create(entityData: DeepPartial<Entity>) {
        const entity = this.repo.create(entityData);
        return this.repo.save(entity);
    }

    async updateOne(filters: DeepPartial<Entity>, values: DeepPartial<Entity>): Promise<Entity | undefined> {
        const entity = await this.repo.findOneBy(filters);
        if (!entity) {
            return undefined;
        }
        let ids = this.repo.getId(entity);
        if (typeof ids !== "object") {
            ids = {[this.idFieldName]: ids};
        }
        await this.repo.update(ids, values);
        return {...entity, ...values};
    }

    async updateMany(filters: DeepPartial<Entity>, values: DeepPartial<Entity>) {
        return await this.repo.update(filters, values).then(value => value.affected);
    }

    async delete(filters: DeepPartial<Entity>) {
        return await this.repo.delete(filters).then(value => value.affected ?? 0);
    }
}
