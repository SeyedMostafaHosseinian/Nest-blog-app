import { MigrationInterface, QueryRunner } from "typeorm";

export class LikeAndFavoriteArticles1702461448434 implements MigrationInterface {
    name = 'LikeAndFavoriteArticles1702461448434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_favorited_articles" ("usersId" uuid NOT NULL, "articlesId" uuid NOT NULL, CONSTRAINT "PK_431c3e44d9cc7ab7dfc0e581790" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9e21d40d3ad78707d9a671375c" ON "users_favorited_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_85b38c3041993070329f0a2505" ON "users_favorited_articles" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "users_favorited_articles" ADD CONSTRAINT "FK_9e21d40d3ad78707d9a671375cb" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_favorited_articles" ADD CONSTRAINT "FK_85b38c3041993070329f0a2505e" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_favorited_articles" DROP CONSTRAINT "FK_85b38c3041993070329f0a2505e"`);
        await queryRunner.query(`ALTER TABLE "users_favorited_articles" DROP CONSTRAINT "FK_9e21d40d3ad78707d9a671375cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_85b38c3041993070329f0a2505"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e21d40d3ad78707d9a671375c"`);
        await queryRunner.query(`DROP TABLE "users_favorited_articles"`);
    }

}
