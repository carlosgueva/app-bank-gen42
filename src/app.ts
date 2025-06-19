import 'reflect-metadata';
import { PostgresDatabase } from './data';
import { envs } from './config/env';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

async function main() {
  const postgres = new PostgresDatabase({
    username: envs.DATABASE_USERNAME,
    password: envs.DATABASE_PASSWORD,
    host: envs.DATABASE_HOST,
    port: Number(envs.DATABASE_PORT),
    database: envs.DATABASE_NAME,
  });

  await postgres.connect();

  const server = new Server({
    port: Number(envs.PORT),
    routes: AppRoutes.getRoutes(postgres.datasource),
  });

  await server.start();

  console.log('Database connected successfully');
}

main();
