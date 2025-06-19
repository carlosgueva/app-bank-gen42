import { DataSource } from 'typeorm';
import { User } from './models/user.model';
import { Transaction } from './models/transaction.model';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
/**
 * Clase para gestionar la conexión a la base de datos PostgresSQL utilizando TypeORM.
 *
 * @remarks
 * Esta clase configura y establece la conexión a una base de datos PostgresSQL utilizando TypeORM.
 *
 * La conexion se configura para sincroizar la base de datos y utilizar SSL con rechazo de certificado no autorizado, en desarrollo.
 *
 * @example
 * ```typescript
 * const postgres = new PostgresDatabase({
 *   host: "localhost",
 *   port: 5432,
 *   username: "user",
 *   password: "password",
 *   database: "database",
 * });
 *
 * await postgres.connect();
 * ```
 */
export class PostgresDatabase {
  public datasource: DataSource;

  /**
   * Crea una instancia de la clase PostgresDatabase.
   *
   * @param options - Opciones de configuración para la conexión a la base de datos.
   */
  constructor(options: Options) {
    this.datasource = new DataSource({
      type: 'postgres',
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.database,
      synchronize: true,
      entities: [User, Transaction],
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Establece la conexión a la base de datos.
   *
   * @remarks
   * @returns - Si ocurre un error al intentar conectar a la base de datos.
   */
  async connect() {
    try {
      await this.datasource.initialize();
      console.log('Postgres database connected!');
    } catch (error) {
      console.error(error);
    }
  }
}
