import {CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../../auth/users/users.entity";
import {UUID} from "backend-batteries";
import {Team} from "../teams.entity";
import {Pk} from "../../helpers/types/entity-types";

@Entity()
export class TeamMember {
    @ManyToOne("User", {onDelete: "CASCADE"})
    user: User;

    @PrimaryColumn()
    userId: Pk<UUID>;

    @ManyToOne("Team", {onDelete: "CASCADE"})
    team: Team;

    @PrimaryColumn()
    teamId: Pk<number>;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;
}
