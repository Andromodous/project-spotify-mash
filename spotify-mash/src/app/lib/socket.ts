// socket.js
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket, io, } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const initSocket = () => {
    //The Manager manages the Engine.IO client instance, which is the low-level engine that establishes the connection to the server
    if (!socket) {
        //Creates a new Manager for the given URL, and attempts to reuse an existing Manager for subsequent calls
        socket = io("http://localhost:3001", { autoConnect : true, multiplex: true, reconnectionDelayMax: 10000, reconnectionAttempts: 10 }) //A new Socket instance is returned for the namespace specified by the pathname in the URL, defaulting to /
        if (socket.connected) {
            console.log(`connected to websocket`)
        }
    }
    return socket;
};
