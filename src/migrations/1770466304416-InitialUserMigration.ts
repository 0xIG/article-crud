import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialUserMigration1770466304416 implements MigrationInterface {
  name = 'InitialUserMigration1770466304416';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user"
      (
        id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email         VARCHAR(100) UNIQUE NOT NULL,
        hash_password VARCHAR(255)        NOT NULL,
        name          VARCHAR(100)        NOT NULL,
        created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(6),
        updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(6)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_user_email ON "user" (email);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_user_created_at ON "user" (created_at);
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_user_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP(6);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_user_updated_at_column
      BEFORE UPDATE ON "user"
      FOR EACH ROW
      EXECUTE FUNCTION update_user_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_user_updated_at_column ON user;
    `);
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_user_updated_at_column();`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_is_active;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_user_created_at;`);

    await queryRunner.query(`DROP TABLE IF EXISTS user;`);
  }
}
