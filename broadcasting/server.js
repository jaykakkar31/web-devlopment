const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const server = require("http").createServer(app);
const port = process.env.PORT || 9000;
const io = require("socket.io")(server, {
	cors: "*",
});

app.use(express.static("public"));

const mongoose = require("mongoose");
// To overcome cors error due to usage React on PORT 3000
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
	"mongodb+srv://admin-jay:admin-jay@cluster0.x65ar.mongodb.net/broadcastDB?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

// const roomId = new mongoose.Schema({
// 	id: "",
// });
// const Room = mongoose.model("RoomId", roomId);
const users = {};
const socketToRoom = {};
var RoomId;
let IdArr = [];

app.get("/api", (req, res) => {
	console.log("ENT?ER");
	if (IdArr) {
		res.send(IdArr);
	}
});

app.delete("/api/:id", (req, res) => {
	IdArr = [];
	res.send(IdArr);
});

app.post("/api/:id/:roomId", (req, res) => {
console.log(req.params.id );
console.log(req.params.roomId);
	users[req.params.id].push(req.params.roomId);
    console.log(users[req.params.id]);
});

io.on("connection", (socket) => {
	console.log("connected");
	socket.on("roomID", (roomid) => {
		// console.log(roomid);
		RoomId = roomid;
		if (IdArr.length === 0) {
			IdArr.push(roomid);
		}

		if (users[roomid]) {
			users[roomid].push(socket.id);
		} else {
			users[roomid] = [socket.id];
		}
		console.log(users[roomid]);
		socket.emit("all users", users[roomid]);
	});

	socket.on("sending signal", (payload) => {
		console.log(payload.userToAdmin + "   sending signal");
		io.to(payload.userToAdmin).emit("user joined", {
			signal: payload.signal,
			callerID: payload.callerID,
		});
	});

	// socket.on("ssIdUser", (id) => {
	// 	const roomID = socketToRoom[socket.id];
	// 	users[roomID].push(id);
	// });

	socket.on("returning signal", (payload) => {
		console.log(JSON.stringify(payload.callerID) + "  returning signal");
		io.to(payload.callerID).emit("receiving returned signal", {
			signal: payload.signal,
			id: socket.id,
		});
	});

	socket.on("disconnect", () => {
		console.log("called");
		const roomID = socketToRoom[socket.id];
		let room = users[roomID];
		if (room) {
			room = room.filter((id) => id !== socket.id);
			users[roomID] = room;
		}
	});
});

if (process.env.NODE_ENV === "production") {
	const path = require("path");
	app.use(express.static(path.join(__dirname, "client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
	});
}

server.listen(port, () => {
	console.log(`server listen at http://localhost:9000`);
});
