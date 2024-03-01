import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Team} from "../../teams/teams.entity";
import type {User} from "../../auth/users/users.entity";
import {Task} from "../tasks/tasks.entity";
import {ForeignId, Pk} from "../../helpers/types/entity-types";

export const MAX_BOARD_DESCRIPTION_LENGTH = 255;
export const MAX_BOARD_NAME_LENGTH = 63;

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: Pk<number>;

    @Column({length: MAX_BOARD_NAME_LENGTH})
    name: string;

    @Column({length: MAX_BOARD_DESCRIPTION_LENGTH, nullable: true})
    description?: string;

    @ManyToOne("Team", {nullable: true, onDelete: "SET NULL"})
    team?: Team;

    @Column({nullable: true})
    teamId?: ForeignId<Team>;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @ManyToOne("User", {nullable: true, onDelete: "SET NULL"})
    author: User;

    @Column()
    authorId: ForeignId<User>;

    @OneToMany("Task", (object: Task) => object.board)
    tasks: Task[];
}
