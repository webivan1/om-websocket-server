"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var socketInit = require('socket.io');
var Websocket = /** @class */ (function () {
    function Websocket(server) {
        this.__connections = new Set();
        this.server = server;
        this.io = socketInit(this.server);
    }
    Object.defineProperty(Websocket.prototype, "connections", {
        get: function () {
            return this.__connections;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Websocket.prototype, "totalConnection", {
        get: function () {
            return this.__connections.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Websocket.prototype, "addConnection", {
        set: function (connection) {
            this.__connections.add(connection);
        },
        enumerable: true,
        configurable: true
    });
    Websocket.prototype.listen = function () {
        var _this = this;
        this.io.on('connection', function (socket) {
            _this.addEvents(socket);
        });
    };
    Websocket.prototype.addEvents = function (socket) {
        var id = socket.id;
        // send connection id
        //socket.emit('total connection', this.totalConnection);
        // socket.on('add connection', this.handlerAddConnection(id));
        // socket.on('remove connection', this.handlerRemoveConnection(id));
        // socket.on('disconnect', this.handlerRemoveConnection(id));
        //
        // socket.on('map get all connections', this.handlerGetAllConnections(socket))
    };
    Websocket.prototype.handlerAddConnection = function (id) {
        var _this = this;
        return function (coords) {
            var connection = __assign(__assign({}, coords), { id: id });
            _this.addConnection = connection;
            _this.io.emit('total connection', _this.totalConnection);
            _this.io.emit('map new connection', __assign({}, connection));
        };
    };
    Websocket.prototype.handlerRemoveConnection = function (id) {
        var _this = this;
        return function () {
            _this.__connections.forEach(function (item) {
                if (item.id === id) {
                    _this.io.emit('map remove connection', __assign({}, item));
                    _this.__connections.delete(item);
                }
            });
            _this.io.emit('total connection', _this.totalConnection);
        };
    };
    Websocket.prototype.handlerGetAllConnections = function (socket) {
        var _this = this;
        return function (border) {
            var groupConnections = [];
            _this.__connections.forEach(function (connection) {
                if (_this.isPointBetweenPoints(connection, border)) {
                    groupConnections.push(__assign({}, connection));
                    if (groupConnections.length > 50) {
                        _this.sendAndClearConnections(socket, groupConnections);
                        groupConnections = [];
                    }
                }
            });
            _this.sendAndClearConnections(socket, groupConnections);
        };
    };
    Websocket.prototype.sendAndClearConnections = function (socket, connections) {
        if (connections.length > 0) {
            socket.emit('map group connections', __spreadArrays(connections));
        }
    };
    Websocket.prototype.isPointBetweenPoints = function (connection, border) {
        return (border.from.lat <= connection.lat && border.from.lng <= connection.lng) &&
            (border.to.lat >= connection.lat && border.to.lng >= connection.lng);
    };
    return Websocket;
}());
exports.default = Websocket;
