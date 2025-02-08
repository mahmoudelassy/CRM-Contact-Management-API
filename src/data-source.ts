import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost', // Docker container host
  port: 5432, // Mapped port from docker run
  username: 'postgres', // Default PostgreSQL username
  password: 'root', // From -e POSTGRES_PASSWORD=root
  database: 'postgres', // Default database name
  synchronize: true,
  logging: true,
  entities: [],
  migrations: [],
  subscribers: [],
});
