import * as http from "http";
import * as express from "express";
import { Application } from "express";
// import * as bodyParser from "body-parser";

const app: Application = express();
const server = http.createServer(app);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

export {
  app,
  server
};