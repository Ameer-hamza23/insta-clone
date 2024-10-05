import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

// socket.js
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const userSocketMap = {}; // This map stores socket id corresponding to the user id; userId -> socketId

export const getRecieverSocketId = (recieverId)=>{
    return userSocketMap[recieverId]
}

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, server, io };
