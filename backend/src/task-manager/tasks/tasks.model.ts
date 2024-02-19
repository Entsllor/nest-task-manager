import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../auth/users/users.model";

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
    authorId: string;
}