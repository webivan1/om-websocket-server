import { app, server } from "./server";
import config from "./config";
import Websocket from "./websocket/Websocket";

// Storage
import StorageMongo from "./storage/StorageMongo";
import StorageRedis from "./storage/StorageRedis";

// Routes
import { routes } from "./routes";

// Mongo
import { connect } from "./mongo/connect";

(async () => {
  await connect();

  const websocket = new Websocket(server, new StorageMongo());
  websocket.listen();
  websocket.runLogger();

  routes(app);
})();

server.listen(config.port, config.host, () => {
  console.log('Server started', `${config.host}:${config.port}`, process.env.NODE_ENV);
});