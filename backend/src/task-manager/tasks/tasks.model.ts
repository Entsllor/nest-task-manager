import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UUID} from "backend-batteries";

@Entity({})
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: UUID;

    @Column({length: 63})
    title: string;

    @Column({nullable: true})
    description?: string;

    @Column({type: "timestamptz", nullable: true})
    deadline?: Date;

    @Column({default: false})
    isHighPriority: boolean;
}