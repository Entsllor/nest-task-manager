import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({})
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length: 63})
    title: string;

    @Column({nullable: true})
    description?: string;

    @Column({type: "timestamptz", nullable: true})
    deadline?: Date;

    @Column({default: false})
    isHighPriority: boolean;
}