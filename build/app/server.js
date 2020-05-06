"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var express = require("express");
// import * as bodyParser from "body-parser";
var app = express();
exports.app = app;
var server = http.createServer(app);
exports.server = server;
