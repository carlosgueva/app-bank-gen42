import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').default('3000').asPortNumber(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),

  DATABASE_USERNAME: get('DATABASE_USERNAME').default('root').asString(),
  DATABASE_PASSWORD: get('DATABASE_PASSWORD').default('').asString(),
  DATABASE_HOST: get('DATABASE_HOST').default('localhost').asString(),
  DATABASE_PORT: get('DATABASE_PORT').default('3306').asPortNumber(),
  DATABASE_NAME: get('DATABASE_NAME').default('entregable4').asString(),

  JWT_KEY: get('JWT_KEY').required().asString(),
  JWT_EXPIRE_IN: get('JWT_EXPIRE_IN').default('3h').asString(),
};
