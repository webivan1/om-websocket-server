import * as mongoose from "mongoose";
import { Mongoose } from "mongoose";
import config from "../config";

export function connect(): Promise<Mongoose> {
  const connect = async () => {
    return await mongoose.connect(`mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      user: config.mongo.user,
      pass: config.mongo.password
    });
  }

  mongoose.connection.on('disconnected', connect);

  return connect();
}