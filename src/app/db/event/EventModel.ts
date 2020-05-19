import { Connection, Pool } from "mysql2/promise";
import { EventType, LogParamsType } from "./types";

export class EventModel {

  private connection: Pool;
  private tableName: string = 'events';

  public constructor(connection: Pool) {
    this.connection = connection;
  }

  async findById(id: number): Promise<EventType|null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [rows] = await this.connection.query(sql, [id]);
    // @ts-ignore
    return rows[0] || null;
  }

  async addLog(params: LogParamsType) {
    const sql = `INSERT INTO event_statistics (event_id, total, created_at) VALUES (?, ?, ?)`;
    await this.connection.query(sql, [params.eventId, params.total, params.createdAt]);
  }
}