import * as http from "http";
import * as express from "express";
import * as exphbs from "express-handlebars";
import { Application } from "express";

const app: Application = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const server = http.createServer(app);

export {
  app,
  server
};