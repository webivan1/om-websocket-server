import {
  ComputeBoundsType,
  ConnectionType,
  IdType
} from "../types";

export interface IStorage {
  get(eventId: number, id: IdType): Promise<ConnectionType|null>;

  set(eventId: number, id: IdType, connection: ConnectionType): Promise<boolean>;

  remove(eventId: number, id: IdType): Promise<true>;

  removeAll(eventId: number): Promise<true>;

  all(eventId: number): Promise<Set<ConnectionType>|null>;

  chunk(eventId: number, size: number, border?: ComputeBoundsType): AsyncIterable<ConnectionType[]>;

  total(eventId: number): Promise<number>;
}