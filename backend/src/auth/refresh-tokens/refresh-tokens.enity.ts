import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import type {User} from "../users/users.entity";
import {ForeignId, Pk} from "../../helpers/types/entity-types";

@Entity({})
export class RefreshToken {
    @PrimaryColumn("varchar", {length: 63})
    body: Pk<string>;

    @ManyToOne("User", {onDelete: "CASCADE"})
    user: User;

    @Column({type: "uuid"})
    userId: ForeignId<User>;

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
