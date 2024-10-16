import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const ormconfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'api.sqlite',
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(ormconfig);
export default dataSource;
