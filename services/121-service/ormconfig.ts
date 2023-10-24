import fs from 'fs';
import { DataSourceOptions } from 'typeorm';

export const ORMConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DBNAME,
  schema: '121-service',
  entities: ['src/**/**.entity.ts'],
  subscribers: ['src/**/**.subscriber.ts'],
  migrationsTableName: 'custom_migration_table',
  migrations: ['migration/*.ts'],
  migrationsRun: true,
  dropSchema: false,
  synchronize: false,
  ssl:
    process.env.NODE_ENV === 'development'
      ? null
      : {
          ca: fs.readFileSync('cert/DigiCertGlobalRootCA.crt.pem').toString(),
        },
};
