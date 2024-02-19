import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../users/users.entity";

@Entity({})
export class RefreshToken {
    @PrimaryColumn({length: 63})
    body: string;

    @ManyToOne("User", {onDelete: "CASCADE"})
    user: User;

    @Column({type: "uuid"})
    userId: string;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @Column({type: "timestamptz"})
    expireAt: Date;

    @Column({length: 31})
    authorIp: string;

    @Column({length: 255})
    userAgent: string;

    @Column({type: "timestamptz", nullable: true})
    revokedAt?: Date;
}
