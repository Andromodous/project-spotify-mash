import { createServer } from 'http'
import { Redis } from 'ioredis'
import { Server, Socket } from 'socket.io'
//Websocket is created when you make upgrade from http to websocket, so it kind of does need http.
//socket.io isn't a pure Websocket server/implementation, it depends on HTTP for its initial connection setup.

//app structure. each event name is located in the same place, which is great for discoverability, 
//but could get out of hand in a medium/big application

const server = createServer();
const io = new Server(server, {
    pingInterval: 25000,
    pingTimeout: 25000,
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});
const port = process.env.PORT || 3000;
const redis_port = process.env.REDIS_PORT || 6379
const subscriber = new Redis(typeof redis_port === "string" ? parseInt(redis_port) : redis_port, process.env.REDIS_HOST || 'redis', {
    password: process.env.REDIS_PASSWORD || ''
})
var data = '';
subscriber.ping().then((v) => console.log('connected to redis ' + v)).catch(() => console.log('could not connect'))

subscriber.subscribe('artists:leaderboard', (err) => {
    if (err) {
        console.log('Could not subscribe to artists:leaderboard channel, perhaps it does not exist yet');
    }
});

io.on('connection', (socket: Socket) => {
    console.log(`new socket connected ${socket.id}`)
    console.log(`number of clients connections is ${io.engine.clientsCount}`);

    if (data !== '') {
        socket.emit('message', data);
    }

    subscriber.on('message', (channel, message) => {
        data = message;
        if (socket.connected) {
            console.log(`${socket.id}: new message from ${channel}: ${message}`);
            socket.emit('message', message);
        }
    });
    socket.on("disconnect", (reason) => {
        console.log(`socket ${socket.id} disconnected: ${reason}`);
        socket.disconnect(true)
    });
})


server.listen(port, () => console.log(`WebSocket Server online at port: ${port}`));



