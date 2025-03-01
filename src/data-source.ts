import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  synchronize: false,
  logging: true,
  entities: ['src/Models/Entities/**/*.ts'],
  migrations: ['src/Models/Migrations/**/*.ts'],
  subscribers: ['src/Models/Subscribers/**/*.ts'],
});
