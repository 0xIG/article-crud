import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialArticleMigration1770837973879 implements MigrationInterface {
  name = 'InitialArticleMigration1770837973879';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "article" (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR(1000) NOT NULL,
        content TEXT NOT NULL,
        author_id INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(6),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP(6),
        CONSTRAINT fk_article_author FOREIGN KEY (author_id) REFERENCES "user"(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_article_author_id ON "article" (author_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_article_created_at ON "article" (created_at);
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_article_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP(6);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_article_updated_at_column
      BEFORE UPDATE ON "article"
      FOR EACH ROW
      EXECUTE FUNCTION update_article_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_article_updated_at_column ON article;
    `);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_article_created_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_article_author_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS article;`);
  }
}
