import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Team} from "../../teams/teams.entity";
import {User} from "../../auth/users/users.entity";
import type {Task} from "../tasks/tasks.entity";

export const MAX_BOARD_DESCRIPTION_LENGTH = 255;
export const MAX_BOARD_NAME_LENGTH = 63;

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: MAX_BOARD_NAME_LENGTH})
    name: string;

    @Column({length: MAX_BOARD_DESCRIPTION_LENGTH, nullable: true})
    description?: string;

    @ManyToOne(() => Team, {nullable: true, onDelete: "SET NULL"})
    team?: Team;

    @Column()
    teamId?: Team["id"];

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @ManyToOne(() => User, {nullable: true, onDelete: "SET NULL"})
    author: User;

    @Column()
    authorId: User["id"];

    @OneToMany("Task", (object: Task) => object.board)
    tasks: Task[];
}
