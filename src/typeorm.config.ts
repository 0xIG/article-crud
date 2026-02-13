import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.js,.ts}'],
  migrations: ['src/migrations/*{.js,.ts}'],
});

export default dataSource;
