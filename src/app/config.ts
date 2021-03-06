import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

type EnvModeFilesType = {
  [key: string]: string;
}

type ModeType = 'production' | 'development';

let envFile = path.resolve(process.cwd(), '.env');

const envMode: ModeType = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const envFiles: EnvModeFilesType = {
  development: path.resolve(process.cwd(), '.env.development'),
  production: path.resolve(process.cwd(), '.env.production')
}

if (envFiles.hasOwnProperty(envMode)) {
  try {
    const pathToEnvFile: string = envFiles[envMode];

    if (fs.existsSync(pathToEnvFile)) {
      envFile = pathToEnvFile;
    }
  } catch (e) { }
}

dotenv.config({
  path: envFile
})

dotenv.config();

export type ConfigType = {
  mode: ModeType;
  host: string;
  port: number;
  origin: string;
  timezone: string;
  redis: {
    host: string;
    port: number;
  },
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
  },
  mongo: {
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
  }
}

const config: ConfigType = {
  mode: envMode,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? +process.env.PORT : 8080,
  origin: process.env.CORS || '*:*',
  timezone: process.env.TIMEZONE || '+00:00',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1:3306',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'secret',
    dbName: process.env.DB_NAME || '',
  },
  mongo: {
    host: process.env.MONGO_HOST || '127.0.0.1:3306',
    port: process.env.MONGO_PORT ? +process.env.MONGO_PORT : 27017,
    user: process.env.MONGO_USER || 'user',
    password: process.env.MONGO_PASSWORD || 'secret',
    dbName: process.env.MONGO_DB_NAME || '',
  }
}

export default config;