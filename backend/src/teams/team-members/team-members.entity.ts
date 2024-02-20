import {CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../auth/users/users.entity";
import {UUID} from "backend-batteries";
import {Team} from "../teams.entity";

@Entity()
export class TeamMember {
    @ManyToOne(() => User, {onDelete: "CASCADE"})
    user: User;

    @PrimaryColumn()
    userId: UUID;

    @ManyToOne(() => Team, {onDelete: "CASCADE"})
    team: Team;

    @PrimaryColumn()
    teamId: number;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;
}
