import { app, server } from "./server";
import { Request, Response } from "express";
import config from "./config";
import Websocket from "./websocket";

if (process.env.NODE_ENV === 'development') {
  // view for test connection
  app.get('/', (req: Request, res: Response) => {
    return res.sendFile(__dirname + '/views/index.html');
  });
}

const websocket = new Websocket(server);

websocket.listen();

server.listen(config.port, () => {
  console.log('Server started', config.port, process.env.NODE_ENV);
});