import * as socketInit from "socket.io";
import * as redisSocketIO  from "socket.io-redis";
import * as moment from "moment";
import { Server } from "http";
import { Socket } from "socket.io";
import { DB } from "../mysql";
import { EventModel } from "../mysql/event/EventModel";
import { isValidateParams } from "./validationQueryParams";
import config from "../config"

// Types
import { IStorage } from "../storage/IStorage";
import {
  IdType,
  LatLngType,
  ConnectionType,
  ComputeBoundsType,
  RequestQueryParamsType
} from "../types";

export default class Websocket {

  public redis: redisSocketIO.RedisAdapter;
  public io: socketInit.Server;
  public static storage: IStorage;
  public eventList: RequestQueryParamsType[] = [];

  constructor(server: Server, storage: IStorage) {
    this.redis = redisSocketIO({
      key: 'websocket_',
      host: config.redis.host,
      port: config.redis.port,
    });

    const io = socketInit(server);
    this.io = io.adapter(this.redis);

    Websocket.storage = storage;
  }

  public listen() {
    this.io.on('connection', this.addEvents.bind(this));
  }

  public addEvents(socketIO: Socket) {
    const id: IdType = socketIO.id;

    const queryParams: RequestQueryParamsType = socketIO.handshake.query;

    if (id && isValidateParams(queryParams)) {
      const { eventId, finishedAt, startAt, timezone } = queryParams;
      const socket = socketIO.join(String(eventId));

      if (this.isFinishedEvent(finishedAt, timezone)) {
        socket.emit('warn', 'Event has been closed');
      } else if (this.isNotStarting(startAt, timezone)) {
        socket.emit('warn', 'Event is not starting');
      } else {
        this.addEventToList(queryParams);

        socket.on('get total', () => {
          this.sendTotalConnection(socket, eventId);
        });

        socket.on('add connection', this.handlerAddConnection(socket, eventId, id));
        socket.on('remove connection', this.handlerRemoveConnection(socket, eventId, id));
        socket.on('disconnect', this.handlerRemoveConnection(socket, eventId, id));

        socket.on('map get all connections', this.handlerGetAllConnections(socket, eventId));
      }
    }
  }

  protected addEventToList(queryParams: RequestQueryParamsType): void {
    if (!this.eventList.some(item => item.eventId === queryParams.eventId)) {
      this.eventList.push(queryParams);
    }
  }

  protected sendTotalConnection(socket: Socket, eventId: number): void {
    Websocket.storage.total(eventId).then(total => {
      this.io.to(String(eventId)).emit('total connection', total);
    });
  }

  protected handlerAddConnection(socket: Socket, eventId: number, id: IdType): (coords: LatLngType) => void {
    return (coords: LatLngType) => {
      const connection: ConnectionType = {...coords, id};

      Websocket.storage.set(eventId, id, connection).then(() => {
        this.io.to(String(eventId)).emit('map new connection', {...connection});
        this.sendTotalConnection(socket, eventId);
      });
    }
  }

  protected handlerRemoveConnection(socket: Socket, eventId: number, id: IdType): () => void {
    return () => {
      Websocket.storage.get(eventId, id).then(async item => {
        this.io.to(String(eventId)).emit('map remove connection', {...item});
        await Websocket.storage.remove(eventId, id);
        this.sendTotalConnection(socket, eventId);
      });
    }
  }

  protected handlerGetAllConnections(socket: Socket, eventId: number): (border: ComputeBoundsType) => void {
    return async (border: ComputeBoundsType) => {
      const iterator = Websocket.storage.chunk(eventId, 200, border);

      for await (const groupConnections of iterator) {
        this.sendAndClearConnections(socket, groupConnections, eventId);
      }
    }
  }

  protected sendAndClearConnections(socket: Socket, connections: ConnectionType[], eventId: number): void {
    if (connections.length > 0) {
      socket.emit('map group connections', [...connections]);
    }
  }

  public isNotStarting(beginAt: number, timezone: string): boolean {
    const current = moment().utcOffset(timezone);
    return current.valueOf() < beginAt;
  }

  public isFinishedEvent(finishedAt: number, timezone: string): boolean {
    const current = moment().utcOffset(timezone);
    return current.valueOf() >= finishedAt;
  }

  protected async safeLog(eventId: number, total: number) {
    const connection = await DB.connect();
    const model = new EventModel(connection);
    const currentDate = moment().utcOffset(config.timezone).format('YYYY-MM-DD HH:mm:ss');
    await model.addLog({
      eventId: eventId,
      total,
      createdAt: currentDate
    });
  }

  protected logger() {
    this.eventList.forEach(async ({ finishedAt, timezone, eventId, duration }, index) => {
      const total = await Websocket.storage.total(eventId);

      if (total > 0) {
        await this.safeLog(eventId, total);
      }

      if (this.isFinishedEvent(finishedAt, timezone)) {
        this.eventList.splice(index, 1);
        await Websocket.storage.removeAll(eventId);
      }
    });
  }

  public runLogger() {
    setInterval(this.logger.bind(this), 60000 * 5)
  }
}