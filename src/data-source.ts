import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  synchronize: true,
  logging: true,
  entities: ['src/Models/Entities/**/*.ts'],
  migrations: ['src/Models/Migrations/**/*.ts'],
  subscribers: ['src/Models/Subscribers/**/*.ts'],
});
