"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var config_1 = require("./config");
var websocket_1 = require("./websocket");
server_1.app.get('/', function (req, res) {
    return res.sendFile(__dirname + '/views/index.html');
});
var websocket = new websocket_1.default(server_1.server);
websocket.listen();
server_1.server.listen(config_1.default.port, function () {
    console.log('Server started', config_1.default.port, process.env.NODE_ENV);
});
