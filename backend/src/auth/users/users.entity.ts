import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import type {Task} from "../../task-manager/tasks/tasks.entity";
import {Pk} from "../../helpers/types/entity-types";

@Entity({})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: Pk<string>;

    @Column({length: 63, unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true, length: 63})
    firstName?: string;

    @Column({nullable: true, length: 63})
    lastName?: string;

    @Column({nullable: true, length: 63})
    timezone?: string;

    @Column({type: "timestamptz", nullable: true})
    birthdate?: Date;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updatedAt: Date;

    @OneToMany("Task", (object: Task) => object.author)
    tasks: Task[];
}
