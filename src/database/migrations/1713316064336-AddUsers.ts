import { MigrationInterface, QueryRunner } from 'typeorm';
import { hash } from 'argon2';

export class AddUsers1713316064336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashAdmin = await hash('adminSuper');
    const hashUser = await hash('userSuper');

    await queryRunner.query(`
    INSERT INTO users (userName, email, password, roleId)
    VALUES 
      ('Admin', 'admin@example.com', '${hashAdmin}', 
        (SELECT id FROM roles WHERE title = 'admin')),
      ('User', 'user@example.com', '${hashUser}', 
        (SELECT id FROM roles WHERE title = 'user'))
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM users WHERE email IN ('admin@example.com', 'user@example.com')
  `);
  }
}
