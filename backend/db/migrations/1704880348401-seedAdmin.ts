import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedAdmin1704880348401 implements MigrationInterface {
    name = 'SeedAdmin1704880348401';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('INSERT INTO "users"("id", "username", "email", "password", "biography", "image", "roles") VALUES (DEFAULT, \'admin\', \'admin@gmail.com\', \'$2b$10$DYNstayih6qrt6HPZzqfku/jxo8qG4ZgWZ3rm3JqZLs1bPIk20NAi\', DEFAULT, DEFAULT, \'{basic, author, subAdmin, admin}\');')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
