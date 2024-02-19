import { MigrationInterface, QueryRunner } from "typeorm";

export class TasksAuthorId1708251884608 implements MigrationInterface {
    name = 'TasksAuthorId1708251884608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(63) NOT NULL, "description" character varying, "deadline" TIMESTAMP WITH TIME ZONE, "isHighPriority" boolean NOT NULL DEFAULT false, "authorId" uuid NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_30cb9d78297c1f2a2e07df1a616" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_30cb9d78297c1f2a2e07df1a616"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
