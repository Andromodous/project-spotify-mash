"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var ioredis_1 = require("ioredis");
var socket_io_1 = require("socket.io");
//Websocket is created when you make upgrade from http to websocket, so it kind of does need http.
//socket.io isn't a pure Websocket server/implementation, it depends on HTTP for its initial connection setup.
//app structure. each event name is located in the same place, which is great for discoverability, 
//but could get out of hand in a medium/big application
var server = (0, http_1.createServer)();
var io = new socket_io_1.Server(server, {
    pingInterval: 25000,
    pingTimeout: 60000,
    cors: {
        origin: process.env.APP_URL || '*',
        methods: ['GET', 'POST'],
    }
});
var port = process.env.PORT || 3000;
var subscriber = new ioredis_1.Redis(process.env.REDIS_URL);
console.log("redis is ".concat(process.env.REDIS_URL));
console.log("this works");
subscriber.subscribe('artists:leaderboard', function (err) {
    if (err) {
        console.log('Could not subscribe to artists:leaderboard channel, perhaps it does not exist yet');
    }
});
io.on('connection', function (socket) {
    console.log("new socket connected ".concat(socket.id));
    console.log("number of clients connections is ".concat(io.engine.clientsCount));
    subscriber.on('message', function (channel, message) {
        if (socket.connected) {
            console.log("".concat(socket.id, ": new message from ").concat(channel, ": ").concat(message));
            socket.emit('message', message);
        }
    });
    socket.on("disconnect", function (reason) {
        console.log("socket disconnected:".concat(reason));
        socket.disconnect(true);
    });
    // socket.on('vote', (data) => {
    //     const voted = redis.sismember('leaderboard:voted', 'example').then((result) => result == 1 ? true : false); //1 (means true, and if it's 0, it means false)
    //     voted.then((vote) => {
    //         if (vote) {
    //         }
    //     })
    // });
});
// instrument(io, {
//     auth: false,
//     mode: "development",
// });
server.listen(port, function () { return console.log("WebSocket Server online at port: ".concat(port)); });
