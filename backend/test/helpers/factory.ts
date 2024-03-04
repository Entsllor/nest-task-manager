import {DataSource, DeepPartial, ObjectLiteral, Repository} from "typeorm";
import {MaybePromise} from "../../src/helpers/types/util-types";
import {keysOf} from "backend-batteries";
import {isFunction} from "radash";

export type FactoryRule<T extends ObjectLiteral> = { [K in keyof T]?: ((data: Partial<T>) => MaybePromise<T[K]>) | T[K] | Factory<any> };

export class Factory<T extends ObjectLiteral> {
    constructor(
        private repo: Repository<T>,
        private rule: FactoryRule<T>) {
    }

    protected async fakeEntityData(initialData: DeepPartial<T>): Promise<DeepPartial<T>> {
        const fakeData = initialData as any;
        for (const key of keysOf(this.rule)) {
            if (fakeData.hasOwnProperty(key)) {
                continue;
            }
            let value = this.rule[key];
            if (value instanceof Factory) {
                value = await value.create();
            }
            if (isFunction(value)) {
                value = value(fakeData);
            }
            fakeData[key] = await value;
        }
        return fakeData;
    }

    protected async prepareEntityData(data: DeepPartial<T>) {
        return {...await this.fakeEntityData(data), ...data};
    }

    async create(data: DeepPartial<T> = {} as DeepPartial<T>): Promise<T> {
        const entityData = await this.prepareEntityData(data);
        const entity = this.repo.create(entityData);
        await this.repo.save(entity);
        return entity;
    }

    async bulkCreate(count: number, data: DeepPartial<T> = {} as DeepPartial<T>) {
        const entities = [];
        for (let i = 0; i < count; i++) {
            entities.push(await this.create(data));
        }
        return entities;
    }
}

export class Factories {
    private factories: Record<string, Factory<any>> = {};

    constructor(private dataSource: DataSource) {
    }

    get<Entity extends ObjectLiteral>(entity: (new () => Entity) | string): Factory<Entity> {
        if (typeof entity === "string") {
            return this.factories[entity];
        }
        return this.factories[entity.name];
    }

    protected getRepository<T extends ObjectLiteral>(model: new () => T): Repository<T> {
        return this.dataSource.getRepository(model);
    }

    registerFactory<Entity extends ObjectLiteral>(model: new () => Entity, rule: FactoryRule<Entity>, options?: {
        factoryName?: string
    }): Factory<Entity> {
        const factory = new Factory(this.getRepository(model), rule);
        this.factories[options?.factoryName ?? model.name] = factory;
        return factory;
    }
}