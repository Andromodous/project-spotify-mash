import { createServer } from 'http';
import { Redis } from 'ioredis'
import { Server, Socket } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
//Websocket is created when you make upgrade from http to websocket, so it kind of does need http.
//socket.io isn't a pure Websocket server/implementation, it depends on HTTP for its initial connection setup.

//app structure. each event name is located in the same place, which is great for discoverability, 
//but could get out of hand in a medium/big application

const server = createServer();
const io = new Server(server, {
    pingInterval: 25000,
    pingTimeout: 60000,
    cors: {
        origin: process.env.APP_URL || '*',
        methods: ['GET', 'POST'],
    }
});
const port = process.env.PORT || 3000;
const subscriber = new Redis(process.env.REDIS_URL as string);

var data = '';

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
        console.log(`socket disconnected: ${reason}`);
        socket.disconnect(true)
    });
})


server.listen(port, () => console.log(`WebSocket Server online at port: ${port}`));



