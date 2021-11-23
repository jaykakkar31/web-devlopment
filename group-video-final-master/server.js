require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = {};

const socketToRoom = {};

io.on('connection', socket => {
      console.log("connected");

    socket.on("join room", roomID => {
            console.log(roomID + "  ROOM ID");

        if (users[roomID]) {
            const length = users[roomID].length;
            console.log(length);
            if (length === 4) {
                socket.emit("room full");
                        console.log("ROOM IS FULL");

                return;
            }
                  console.log("SOCKET ID " + socket.id);

            users[roomID].push(socket.id);
        } else {
                  console.log("CREATING NEW ROOM");

            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
    console.log("USER IN THE ROOM " + usersInThisRoom);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log("called");
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));


