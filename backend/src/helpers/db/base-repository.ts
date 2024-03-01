import {
    DataSource,
    DeepPartial,
    EntityManager,
    EntityTarget,
    FindOptionsWhere,
    ObjectLiteral,
    Repository,
} from "typeorm";
import {ClsService} from "nestjs-cls";
import {QUERY_MANAGER_KEY} from "../../common/db/db.transactions.interceptor";
import {PrimaryKeysOf} from "../types/entity-types";


export abstract class BaseRepository<Entity extends ObjectLiteral> {
    abstract model: EntityTarget<Entity>;
    readonly idFieldName: string = "id";

    constructor(protected dataSource: DataSource, private cls: ClsService) {
    }

    abstract getByPk(id: string | number | Date | symbol, ...extraPrimaryKeys: any[]): Promise<Entity | null>

    private initRepo(): Repository<Entity> {
        return ((this.cls?.get(QUERY_MANAGER_KEY) as EntityManager | undefined) ?? this.dataSource).getRepository(this.model);
    }

    protected get repo(): Repository<Entity> {
        return this.initRepo();
    }


    async get(criteria: Entity): Promise<Entity>
    async get(criteria: PrimaryKeysOf<Entity>): Promise<Entity | null>
    async get(criteria: PrimaryKeysOf<Entity> | Entity): Promise<Entity | null> {
        if (criteria instanceof (this.model as new () => Entity)) {
            return criteria;
        }
        return this.findOne(criteria as FindOptionsWhere<Entity>);
    }

    findOne(criteria?: FindOptionsWhere<Entity>) {
        return this.repo.findOneBy(criteria ?? {});
    }

    findMany(criteria?: FindOptionsWhere<Entity>) {
        return this.repo.findBy(criteria ?? {});
    }

    async bulkCreate(entitiesData: DeepPartial<Entity>[]): Promise<Entity[]> {
        const entities = entitiesData.map(this.repo.create);
        return this.repo.insert(entities).then(result => result.generatedMaps as Entity[]);
    }

    create(entityData: DeepPartial<Entity>) {
        const entity = this.repo.create(entityData);
        return this.repo.save(entity);
    }

    async updateOne(filters: FindOptionsWhere<Entity>, values: DeepPartial<Entity>): Promise<Entity | undefined> {
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

    async updateMany(filters: FindOptionsWhere<Entity>, values: DeepPartial<Entity>) {
        return await this.repo.update(filters, values).then(value => value.affected);
    }

    async delete(filters: FindOptionsWhere<Entity>) {
        return await this.repo.delete(filters).then(value => value.affected ?? 0);
    }
}
