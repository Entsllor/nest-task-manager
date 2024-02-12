import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshTokens1707748504576 implements MigrationInterface {
    name = 'RefreshTokens1707748504576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token" ("body" character varying(63) NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expireAt" TIMESTAMP WITH TIME ZONE NOT NULL, "authorIp" character varying(31) NOT NULL, "userAgent" character varying(255) NOT NULL, "revokedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7c3b24b916368b2ae91fc510084" PRIMARY KEY ("body"))`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
    }

}
