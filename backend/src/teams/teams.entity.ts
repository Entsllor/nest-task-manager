import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../auth/users/users.entity";
import {UUID} from "backend-batteries";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column()
    name: string;

    @Column({nullable: true})
    description?: string;

    @ManyToOne(() => User, {onDelete: "SET NULL", nullable: true})
    author: User;

    @Column({nullable: true})
    authorId?: UUID;

}
