import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1729093816233 implements MigrationInterface {
    name = 'Migration1729093816233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "slug" varchar NOT NULL, "body" varchar NOT NULL DEFAULT (''), "description" varchar NOT NULL DEFAULT (''), "tagsList" text NOT NULL, "likesCount" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "updaterAuthorId" varchar)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "biography" varchar NOT NULL DEFAULT (''), "image" varchar NOT NULL DEFAULT (''), "roles" varchar CHECK( "roles" IN ('admin','subAdmin','author','basic') ) NOT NULL DEFAULT ('basic'))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "articleId" varchar, "parentCommentId" varchar)`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "users_favored_articles" ("usersId" varchar NOT NULL, "articlesId" varchar NOT NULL, PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e554512ebb8090e4f373880650" ON "users_favored_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_44e7f9092d9d344aaf7b53d4bd" ON "users_favored_articles" ("articlesId") `);
        await queryRunner.query(`CREATE TABLE "user_followers" ("usersId_1" varchar NOT NULL, "usersId_2" varchar NOT NULL, PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2c80e08dfc872dae9aa64efbb" ON "user_followers" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_68e594a8874a92aa113ae7525d" ON "user_followers" ("usersId_2") `);
        await queryRunner.query(`CREATE TABLE "comments_closure" ("id_ancestor" varchar NOT NULL, "id_descendant" varchar NOT NULL, PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_89a2762362d968c2939b6fab19" ON "comments_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2164211fd6ab117cfb2ab8ba9" ON "comments_closure" ("id_descendant") `);
        await queryRunner.query(`CREATE TABLE "temporary_articles" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "slug" varchar NOT NULL, "body" varchar NOT NULL DEFAULT (''), "description" varchar NOT NULL DEFAULT (''), "tagsList" text NOT NULL, "likesCount" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "updaterAuthorId" varchar, CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_79edd8f6a8e3d846b7e80b52001" FOREIGN KEY ("updaterAuthorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_articles"("id", "title", "slug", "body", "description", "tagsList", "likesCount", "created_at", "updated_at", "authorId", "updaterAuthorId") SELECT "id", "title", "slug", "body", "description", "tagsList", "likesCount", "created_at", "updated_at", "authorId", "updaterAuthorId" FROM "articles"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`ALTER TABLE "temporary_articles" RENAME TO "articles"`);
        await queryRunner.query(`CREATE TABLE "temporary_comments" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "articleId" varchar, "parentCommentId" varchar, CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comments"("id", "title", "description", "createdAt", "updatedAt", "authorId", "articleId", "parentCommentId") SELECT "id", "title", "description", "createdAt", "updatedAt", "authorId", "articleId", "parentCommentId" FROM "comments"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`ALTER TABLE "temporary_comments" RENAME TO "comments"`);
        await queryRunner.query(`DROP INDEX "IDX_e554512ebb8090e4f373880650"`);
        await queryRunner.query(`DROP INDEX "IDX_44e7f9092d9d344aaf7b53d4bd"`);
        await queryRunner.query(`CREATE TABLE "temporary_users_favored_articles" ("usersId" varchar NOT NULL, "articlesId" varchar NOT NULL, CONSTRAINT "FK_e554512ebb8090e4f373880650f" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_44e7f9092d9d344aaf7b53d4bd9" FOREIGN KEY ("articlesId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`INSERT INTO "temporary_users_favored_articles"("usersId", "articlesId") SELECT "usersId", "articlesId" FROM "users_favored_articles"`);
        await queryRunner.query(`DROP TABLE "users_favored_articles"`);
        await queryRunner.query(`ALTER TABLE "temporary_users_favored_articles" RENAME TO "users_favored_articles"`);
        await queryRunner.query(`CREATE INDEX "IDX_e554512ebb8090e4f373880650" ON "users_favored_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_44e7f9092d9d344aaf7b53d4bd" ON "users_favored_articles" ("articlesId") `);
        await queryRunner.query(`DROP INDEX "IDX_e2c80e08dfc872dae9aa64efbb"`);
        await queryRunner.query(`DROP INDEX "IDX_68e594a8874a92aa113ae7525d"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_followers" ("usersId_1" varchar NOT NULL, "usersId_2" varchar NOT NULL, CONSTRAINT "FK_e2c80e08dfc872dae9aa64efbbf" FOREIGN KEY ("usersId_1") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_68e594a8874a92aa113ae7525df" FOREIGN KEY ("usersId_2") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`INSERT INTO "temporary_user_followers"("usersId_1", "usersId_2") SELECT "usersId_1", "usersId_2" FROM "user_followers"`);
        await queryRunner.query(`DROP TABLE "user_followers"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_followers" RENAME TO "user_followers"`);
        await queryRunner.query(`CREATE INDEX "IDX_e2c80e08dfc872dae9aa64efbb" ON "user_followers" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_68e594a8874a92aa113ae7525d" ON "user_followers" ("usersId_2") `);
        await queryRunner.query(`DROP INDEX "IDX_89a2762362d968c2939b6fab19"`);
        await queryRunner.query(`DROP INDEX "IDX_d2164211fd6ab117cfb2ab8ba9"`);
        await queryRunner.query(`CREATE TABLE "temporary_comments_closure" ("id_ancestor" varchar NOT NULL, "id_descendant" varchar NOT NULL, CONSTRAINT "FK_89a2762362d968c2939b6fab193" FOREIGN KEY ("id_ancestor") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d2164211fd6ab117cfb2ab8ba96" FOREIGN KEY ("id_descendant") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`INSERT INTO "temporary_comments_closure"("id_ancestor", "id_descendant") SELECT "id_ancestor", "id_descendant" FROM "comments_closure"`);
        await queryRunner.query(`DROP TABLE "comments_closure"`);
        await queryRunner.query(`ALTER TABLE "temporary_comments_closure" RENAME TO "comments_closure"`);
        await queryRunner.query(`CREATE INDEX "IDX_89a2762362d968c2939b6fab19" ON "comments_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2164211fd6ab117cfb2ab8ba9" ON "comments_closure" ("id_descendant") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_d2164211fd6ab117cfb2ab8ba9"`);
        await queryRunner.query(`DROP INDEX "IDX_89a2762362d968c2939b6fab19"`);
        await queryRunner.query(`ALTER TABLE "comments_closure" RENAME TO "temporary_comments_closure"`);
        await queryRunner.query(`CREATE TABLE "comments_closure" ("id_ancestor" varchar NOT NULL, "id_descendant" varchar NOT NULL, PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`INSERT INTO "comments_closure"("id_ancestor", "id_descendant") SELECT "id_ancestor", "id_descendant" FROM "temporary_comments_closure"`);
        await queryRunner.query(`DROP TABLE "temporary_comments_closure"`);
        await queryRunner.query(`CREATE INDEX "IDX_d2164211fd6ab117cfb2ab8ba9" ON "comments_closure" ("id_descendant") `);
        await queryRunner.query(`CREATE INDEX "IDX_89a2762362d968c2939b6fab19" ON "comments_closure" ("id_ancestor") `);
        await queryRunner.query(`DROP INDEX "IDX_68e594a8874a92aa113ae7525d"`);
        await queryRunner.query(`DROP INDEX "IDX_e2c80e08dfc872dae9aa64efbb"`);
        await queryRunner.query(`ALTER TABLE "user_followers" RENAME TO "temporary_user_followers"`);
        await queryRunner.query(`CREATE TABLE "user_followers" ("usersId_1" varchar NOT NULL, "usersId_2" varchar NOT NULL, PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`INSERT INTO "user_followers"("usersId_1", "usersId_2") SELECT "usersId_1", "usersId_2" FROM "temporary_user_followers"`);
        await queryRunner.query(`DROP TABLE "temporary_user_followers"`);
        await queryRunner.query(`CREATE INDEX "IDX_68e594a8874a92aa113ae7525d" ON "user_followers" ("usersId_2") `);
        await queryRunner.query(`CREATE INDEX "IDX_e2c80e08dfc872dae9aa64efbb" ON "user_followers" ("usersId_1") `);
        await queryRunner.query(`DROP INDEX "IDX_44e7f9092d9d344aaf7b53d4bd"`);
        await queryRunner.query(`DROP INDEX "IDX_e554512ebb8090e4f373880650"`);
        await queryRunner.query(`ALTER TABLE "users_favored_articles" RENAME TO "temporary_users_favored_articles"`);
        await queryRunner.query(`CREATE TABLE "users_favored_articles" ("usersId" varchar NOT NULL, "articlesId" varchar NOT NULL, PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`INSERT INTO "users_favored_articles"("usersId", "articlesId") SELECT "usersId", "articlesId" FROM "temporary_users_favored_articles"`);
        await queryRunner.query(`DROP TABLE "temporary_users_favored_articles"`);
        await queryRunner.query(`CREATE INDEX "IDX_44e7f9092d9d344aaf7b53d4bd" ON "users_favored_articles" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e554512ebb8090e4f373880650" ON "users_favored_articles" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "comments" RENAME TO "temporary_comments"`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "articleId" varchar, "parentCommentId" varchar)`);
        await queryRunner.query(`INSERT INTO "comments"("id", "title", "description", "createdAt", "updatedAt", "authorId", "articleId", "parentCommentId") SELECT "id", "title", "description", "createdAt", "updatedAt", "authorId", "articleId", "parentCommentId" FROM "temporary_comments"`);
        await queryRunner.query(`DROP TABLE "temporary_comments"`);
        await queryRunner.query(`ALTER TABLE "articles" RENAME TO "temporary_articles"`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "slug" varchar NOT NULL, "body" varchar NOT NULL DEFAULT (''), "description" varchar NOT NULL DEFAULT (''), "tagsList" text NOT NULL, "likesCount" integer NOT NULL DEFAULT (0), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, "updaterAuthorId" varchar)`);
        await queryRunner.query(`INSERT INTO "articles"("id", "title", "slug", "body", "description", "tagsList", "likesCount", "created_at", "updated_at", "authorId", "updaterAuthorId") SELECT "id", "title", "slug", "body", "description", "tagsList", "likesCount", "created_at", "updated_at", "authorId", "updaterAuthorId" FROM "temporary_articles"`);
        await queryRunner.query(`DROP TABLE "temporary_articles"`);
        await queryRunner.query(`DROP INDEX "IDX_d2164211fd6ab117cfb2ab8ba9"`);
        await queryRunner.query(`DROP INDEX "IDX_89a2762362d968c2939b6fab19"`);
        await queryRunner.query(`DROP TABLE "comments_closure"`);
        await queryRunner.query(`DROP INDEX "IDX_68e594a8874a92aa113ae7525d"`);
        await queryRunner.query(`DROP INDEX "IDX_e2c80e08dfc872dae9aa64efbb"`);
        await queryRunner.query(`DROP TABLE "user_followers"`);
        await queryRunner.query(`DROP INDEX "IDX_44e7f9092d9d344aaf7b53d4bd"`);
        await queryRunner.query(`DROP INDEX "IDX_e554512ebb8090e4f373880650"`);
        await queryRunner.query(`DROP TABLE "users_favored_articles"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
