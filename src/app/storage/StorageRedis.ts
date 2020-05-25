import { createClient, RedisClient } from "redis";
import config from "../config";

// Types
import { IStorage } from "./IStorage";
import { ComputeBoundsType, ConnectionType, IdType } from "../types";

export default class StorageRedis implements IStorage {

  private server: RedisClient;

  constructor() {
    this.server = createClient(config.redis.port, config.redis.host);
  }

  public get(eventId: number, id: IdType): Promise<ConnectionType|null> {
    return new Promise((resolve, reject) => {
      this.server.hget(String(eventId), id, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          if (reply) {
            const value: ConnectionType = JSON.parse(reply);
            resolve(value);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public set(eventId: number, id: IdType, connection: ConnectionType): Promise<boolean> {
    return new Promise(resolve => {
      this.server.hset(String(eventId), id, JSON.stringify(connection), (err, reply) => {
        resolve(err ? false : true);
      });
    });
  }

  public remove(eventId: number, id: IdType): Promise<true> {
    return new Promise(resolve => {
      this.server.hdel(String(eventId), id, (err, reply) => {
        resolve(true);
      });
    });
  }

  public removeAll(eventId: number): Promise<true> {
    return new Promise(async resolve => {
      const connections = await this.all(eventId);
      if (connections) {
        connections.forEach(connection => {
          this.remove(eventId, connection.id);
        });
        resolve(true);
      }
    });
  }

  public async *chunk(eventId: number, size: number, border?: ComputeBoundsType): AsyncIterable<ConnectionType[]> {
    const promise = new Promise<Array<ConnectionType[]>>(resolve => {
      this.server.hgetall(String(eventId), (err, reply) => {
        if (reply) {
          const data: Array<ConnectionType[]> = [];

          let rows: Array<ConnectionType> = [];

          for (const key in reply) {
            const value: ConnectionType = JSON.parse(reply[key]);

            if (border && !this.isPointBetweenPoints(value, border)) {
              continue;
            }

            rows.push(value);

            if (rows.length >= size) {
              data.push([...rows]);
              rows = [];
            }
          }

          if (rows.length) {
            data.push([...rows]);
          }

          resolve(data);
        }
      });
    });

    const data: Array<ConnectionType[]> = await promise;

    for (const key in data) {
      yield data[key];
    }
  }

  protected isPointBetweenPoints(connection: ConnectionType, border: ComputeBoundsType): boolean {
    return (border.from.lat <= connection.lat && border.from.lng <= connection.lng) &&
      (border.to.lat >= connection.lat && border.to.lng >= connection.lng);
  }

  public async all(eventId: number): Promise<Set<ConnectionType>|null> {
    const data = new Set<ConnectionType>();
    const iterator = this.chunk(eventId, 300);

    for await (const items of iterator) {
      items.forEach(item => data.add(item));
    }

    return data;
  }

  public total(eventId: number): Promise<number> {
    return new Promise(resolve => {
      this.server.hlen(String(eventId), (err, reply) => {
        resolve(reply);
      });
    });
  }
}