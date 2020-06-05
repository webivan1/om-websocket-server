import { Connection, Pool } from "mysql2/promise";
import { EventType, LogParamsType, RegionType } from "./types";

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
    let event: EventType|null = rows[0];

    if (event) {
      const sqlRegion = `SELECT * FROM regions WHERE id = ?`;
      const [rows] = await this.connection.query(sql, [event.id]);
      // @ts-ignore
      const region: RegionType|null = rows[0];

      if (region) {
        event = {...event, region};
      }
    }

    return event;
  }

  async addLog(params: LogParamsType) {
    const sql = `INSERT INTO event_statistics (event_id, total, created_at) VALUES (?, ?, ?)`;
    await this.connection.query(sql, [params.eventId, params.total, params.createdAt]);
  }
}