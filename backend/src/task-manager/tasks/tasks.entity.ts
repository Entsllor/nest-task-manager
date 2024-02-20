import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "../../auth/users/users.entity";
import {Board} from "../boards/boards.entity";


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

    @ManyToOne("User", (object: User) => object.tasks, {onDelete: "CASCADE"})
    author: User;

    @Column({type: "uuid"})
    authorId: User["id"];

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updatedAt: Date;

    @ManyToOne("Board", (object: Board) => object.tasks)
    board: Board;

    @Column()
    boardId: Board["id"];

    @Column()
    isCompleted: boolean;

    @ManyToOne("User", {onDelete: "SET NULL", nullable: true})
    completedByUser?: User;

    @Column()
    completedByUserId?: User["id"];
}