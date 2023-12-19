import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsForArticles1702730462212 implements MigrationInterface {
    name = 'AddCommentsForArticles1702730462212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "articleId" uuid, "parentCommentId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_a02e5093a5d47a64f1fd473d1ef" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_89a2762362d968c2939b6fab19" ON "comments_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2164211fd6ab117cfb2ab8ba9" ON "comments_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments_closure" ADD CONSTRAINT "FK_89a2762362d968c2939b6fab193" FOREIGN KEY ("id_ancestor") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments_closure" ADD CONSTRAINT "FK_d2164211fd6ab117cfb2ab8ba96" FOREIGN KEY ("id_descendant") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments_closure" DROP CONSTRAINT "FK_d2164211fd6ab117cfb2ab8ba96"`);
        await queryRunner.query(`ALTER TABLE "comments_closure" DROP CONSTRAINT "FK_89a2762362d968c2939b6fab193"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4875672591221a61ace66f2d4f9"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2164211fd6ab117cfb2ab8ba9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89a2762362d968c2939b6fab19"`);
        await queryRunner.query(`DROP TABLE "comments_closure"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
