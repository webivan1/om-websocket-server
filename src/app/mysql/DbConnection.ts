import { createPool, Pool } from "mysql2/promise";
import config from "../config";

export default class DbConnection {
  private static connection: Pool|null = null;

  private constructor() {  }

  public static async connect(): Promise<Pool> {
    if (!DbConnection.connection) {
      DbConnection.connection = await createPool({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.dbName,
        port: config.db.port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }

    return DbConnection.connection;
  }
}