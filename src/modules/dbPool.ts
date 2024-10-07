import dotenv from "dotenv";
import mysql, { Pool, PoolConnection } from "mysql2/promise";

dotenv.config({ path: __dirname + "/.env" });

// DB connect info
interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

const config = {
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || ""
};

class MySQLRepository {
  private static instance: MySQLRepository;
  private pool: Pool;

  constructor(config: MySQLConfig) {
    console.log("MySQL has been connected...");
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  public static getInstance(config: MySQLConfig): MySQLRepository {
    if (!MySQLRepository.instance) {
      MySQLRepository.instance = new MySQLRepository(config);
    }
    return MySQLRepository.instance;
  }

  public async executeQuery(sql: string, values?: any[]): Promise<any> {
    let connection: PoolConnection | null = null;
    try {
      connection = await this.pool.getConnection(); // Promise 기반 getConnection 사용
      const [result] = await connection.query(sql, values); // SQL 쿼리 실행
      return result;
    } catch (err) {
      console.log("err:", err);
      throw new Error(err as string); // 오류 처리
    } finally {
      if (connection) {
        connection.release(); // 연결 해제
      }
    }
  }
}

export default { config, MySQLRepository };
