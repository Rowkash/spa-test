import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoles1713315720786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
		INSERT INTO roles (title) VALUES ('admin'), ('user')
	`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
		DELETE FROM roles WHERE title IN ('admin', 'user')
	`);
  }
}
