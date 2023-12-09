import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdaterAuthorInArticle1702127321935 implements MigrationInterface {
    name = 'AddUpdaterAuthorInArticle1702127321935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "updaterAuthorId" uuid`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_79edd8f6a8e3d846b7e80b52001" FOREIGN KEY ("updaterAuthorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_79edd8f6a8e3d846b7e80b52001"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "updaterAuthorId"`);
    }

}
