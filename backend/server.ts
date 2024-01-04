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
const subscriber = new Redis(typeof redis_port === "string" ?
    parseInt(redis_port) : redis_port, process.env.REDIS_HOST || 'redis', {
    password: process.env.REDIS_PASSWORD || ''
})
if (subscriber.status === 'connect' || subscriber.status === 'ready') {
    console.log('connected to redis')
}

subscriber.subscribe('artists:leaderboard', (err) => {
    if (err) {
        console.log('Could not subscribe to artists:leaderboard channel, perhaps it does not exist yet');
    }
});

io.on('connection', (socket: Socket) => {
    console.log(`new socket connected ${socket.id}`)
    console.log(`number of clients connections is ${io.engine.clientsCount}`);

    subscriber.on('message', (channel, message) => {
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


process.on('SIGTERM', () => { //SIGTERM signal received by cloud run to handle scaled down instances
    console.log('gracefully shutting down')
    subscriber.unsubscribe()
    subscriber.disconnect()
    io.disconnectSockets();
})

if (subscriber.status === 'close') {
    console.log('closed connection to redis')
}

server.listen(port, () => console.log(`WebSocket server online at port: ${port}`));



