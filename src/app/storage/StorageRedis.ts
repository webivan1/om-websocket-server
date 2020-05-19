import { createClient, RedisClient } from "redis";
import config from "../config";
import { IStorage } from "./IStorage";
import { ConnectionType, IdType } from "../types";

export default class StorageRedis implements IStorage {

  private server: RedisClient;

  constructor() {
    this.server = createClient(config.redis.port, config.redis.host);
  }

  public get(eventId: number, id: IdType): Promise<ConnectionType> {
    return new Promise((resolve, reject) => {
      this.server.hget(String(eventId), id, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          const value: ConnectionType = JSON.parse(reply);
          resolve(value);
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

  public all(eventId: number): Promise<Set<ConnectionType>|null> {
    return new Promise(resolve => {
      this.server.hgetall(String(eventId), (err, reply) => {
        if (err || !reply) {
          resolve(null);
        } else {
          const data = new Set<ConnectionType>();

          Object.keys(reply).map(key => {
            const value: ConnectionType = JSON.parse(reply[key]);
            data.add(value);
          });

          resolve(data);
        }
      });
    });
  }

  public total(eventId: number): Promise<number> {
    return new Promise(resolve => {
      this.server.hlen(String(eventId), (err, reply) => {
        resolve(reply);
      });
    });
  }
}