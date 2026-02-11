import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migration/**/*{.js,.ts}'],
  migrationsRun: false,
  migrationsTableName: 'migration',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
