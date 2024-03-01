import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import type {User} from "../auth/users/users.entity";
import type {TeamMember} from "./team-members/team-members.entity";
import {ForeignKey, Pk} from "../helpers/types/entity-types";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: Pk<number>;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column()
    name: string;

    @Column({nullable: true})
    description?: string;

    @ManyToOne("User", {onDelete: "SET NULL", nullable: true})
    author: User;

    @Column({nullable: true})
    authorId?: ForeignKey<User, "id">;

    @OneToMany("TeamMember", (obj: TeamMember) => obj.team)
    members: TeamMember[];
}
