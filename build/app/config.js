"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path = require("path");
var fs = require("fs");
var envFile = path.resolve(process.cwd(), '.env');
var envMode = process.env.NODE_ENV || '';
var envFiles = {
    development: path.resolve(process.cwd(), '.env.development'),
    production: path.resolve(process.cwd(), '.env.production')
};
if (envFiles.hasOwnProperty(envMode)) {
    try {
        var pathToEnvFile = envFiles[envMode];
        if (fs.existsSync(pathToEnvFile)) {
            envFile = pathToEnvFile;
        }
    }
    catch (e) { }
}
dotenv.config({
    path: envFile
});
dotenv.config();
var config = {
    port: process.env.PORT ? +process.env.PORT : 8080,
    origin: process.env.CORS || '*:*',
};
exports.default = config;
