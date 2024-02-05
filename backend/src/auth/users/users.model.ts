import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity({})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length: 63, unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true, length: 63})
    firstName?: string;

    @Column({nullable: true, length: 63})
    lastName?: string;

    @Column({nullable: true, length: 63})
    timezone?: string;

    @Column({type: "timestamptz", nullable: true})
    birthdate?: Date;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz"})
    updatedAt: Date;

    // @OneToMany(() => RefreshToken, object => object.user)
    // refreshTokens: RefreshToken[];
}
