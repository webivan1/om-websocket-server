// import * as socketInit from "socket.io";
import { Socket } from "socket.io";
import { Server } from "http";
import config from "./config";

const socketInit = require('socket.io');

export type LatLng = {
  lat: number;
  lng: number;
};

export type IdType = string;

export type ConnectionType = LatLng & {
  id: IdType
};

export type ComputeBoundsType = {
  from: LatLng;
  to: LatLng;
}

export default class Websocket {
  public server: Server;
  public io: SocketIO.Server;
  private __connections: Set<ConnectionType> = new Set();

  constructor(server: Server) {
    this.server = server;
    this.io = socketInit(this.server);
  }

  get connections(): Set<ConnectionType> {
    return this.__connections;
  }

  get totalConnection(): number {
    return this.__connections.size;
  }

  set addConnection(connection: ConnectionType) {
    this.__connections.add(connection);
  }

  public listen(): void {
    this.io.on('connection', (socket) => {
      this.addEvents(socket);
    });
  }

  protected addEvents(socket: Socket) {
    const id: IdType = socket.id;

    socket.emit('total connection', this.totalConnection);

    socket.on('add connection', this.handlerAddConnection(id));
    socket.on('remove connection', this.handlerRemoveConnection(id));
    socket.on('disconnect', this.handlerRemoveConnection(id));

    socket.on('map get all connections', this.handlerGetAllConnections(socket));
  }

  protected handlerAddConnection(id: IdType): (coords: LatLng) => void {
    return (coords: LatLng) => {
      const connection: ConnectionType = {...coords, id};
      this.addConnection = connection;

      this.io.emit('total connection', this.totalConnection);
      this.io.emit('map new connection', {...connection});
    }
  }

  protected handlerRemoveConnection(id: IdType): () => void {
    return () => {
      this.__connections.forEach(item => {
        if (item.id === id) {
          this.io.emit('map remove connection', {...item});
          this.__connections.delete(item);
        }
      });

      this.io.emit('total connection', this.totalConnection);
    }
  }

  protected handlerGetAllConnections(socket: Socket): (border: ComputeBoundsType) => void {
    return (border: ComputeBoundsType) => {
      let groupConnections: ConnectionType[] = [];

      this.__connections.forEach(connection => {
        if (this.isPointBetweenPoints(connection, border)) {
          groupConnections.push({...connection});

          if (groupConnections.length > 50) {
            this.sendAndClearConnections(socket, groupConnections);
            groupConnections = [];
          }
        }
      });

      this.sendAndClearConnections(socket, groupConnections);
    }
  }

  protected sendAndClearConnections(socket: Socket, connections: ConnectionType[]): void {
    if (connections.length > 0) {
      socket.emit('map group connections', [...connections]);
    }
  }

  public isPointBetweenPoints(connection: ConnectionType, border: ComputeBoundsType): boolean {
    return (border.from.lat <= connection.lat && border.from.lng <= connection.lng) &&
      (border.to.lat >= connection.lat && border.to.lng >= connection.lng);
  }
}