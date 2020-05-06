import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

type EnvModeFilesType = {
  [key: string]: string;
}

let envFile = path.resolve(process.cwd(), '.env');

const envMode: string = process.env.NODE_ENV || '';

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
  port: number;
  origin: string;
}

const config: ConfigType = {
  port: process.env.PORT ? +process.env.PORT : 8080,
  origin: process.env.CORS || '*:*',
}

export default config;