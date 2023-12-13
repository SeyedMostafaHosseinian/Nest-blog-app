import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFollowing1702484811448 implements MigrationInterface {
    name = 'AddFollowing1702484811448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_followers" ("usersId_1" uuid NOT NULL, "usersId_2" uuid NOT NULL, CONSTRAINT "PK_cbd7f8b8e397b3867f245daf264" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2c80e08dfc872dae9aa64efbb" ON "user_followers" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_68e594a8874a92aa113ae7525d" ON "user_followers" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_e2c80e08dfc872dae9aa64efbbf" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_68e594a8874a92aa113ae7525df" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_68e594a8874a92aa113ae7525df"`);
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_e2c80e08dfc872dae9aa64efbbf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68e594a8874a92aa113ae7525d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2c80e08dfc872dae9aa64efbb"`);
        await queryRunner.query(`DROP TABLE "user_followers"`);
    }

}
