import "./liveCast.css";
import Footer from "./footer/footer";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios";
import { deleteId } from "../../userService/userService";
const shortid = require("shortid");

const LiveCast = ({ setJoinDisable, setDisable }) => {

	const userVideo = useRef();
	const ssVideo = useRef();
	const [streamObj, setStreamObj] = useState();
	const socketRef = useRef();
	const { id } = useParams();
	const peersRef = useRef([]);
	const [peers, setPeers] = useState([]);
	const [isPresenting, setIsPresenting] = useState(false);
	const adminId = useRef();
	const [isAdmin, setIsAdmin] = useState(false);


	

	if (window.location.hash === "#init") {
		window.addEventListener("beforeunload", function (e) {
			// e.preventDefault();
			deleteId(id);

			e.returnValue = "Are you sure you want to exit?";
			console.log(e.returnValue);
		});
	}

	useEffect(() => {
		socketRef.current = io.connect("/");
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setStreamObj(stream);
				//Screen Share
				var canvas = document.getElementById("localCanvas");

				console.log(stream);

				if (window.location.hash === "#init") {
					navigator.mediaDevices
						//Cursor True is means sending cursor also of the person sharing screen to the person recieving the screen
						.getDisplayMedia({ cursor: true })
						.then((screenStream) => {
							let localStream2 = screenStream;
							var localVideo = document.getElementById("adminVid");
							var localVideo2 = document.getElementById("ssVideo");
							localVideo2.hidden = false;
							canvas.hidden = false;
							localVideo.style.width = "0";
							localVideo.style.height = "0";
							localVideo2.style.width = "0";
							localVideo2.style.height = "0";

							console.log(screenStream.getVideoTracks()[0].getSettings().width);
							canvas.width = screenStream
								.getVideoTracks()[0]
								.getSettings().width;
							canvas.height = screenStream
								.getVideoTracks()[0]
								.getSettings().height;
							var ctx = canvas.getContext("2d");
							 setInterval(() => {
								if (
									canvas.width !==
									localStream2.getVideoTracks()[0].getSettings().width
								) {
									canvas.width = localStream2
										.getVideoTracks()[0]
										.getSettings().width;
									canvas.height = localStream2
										.getVideoTracks()[0]
										.getSettings().height;
								}
								let h = canvas.height - 240;
								let w = canvas.width - 320;
								ctx.drawImage(localVideo2, 0, 0);
								ctx.drawImage(localVideo, w, h, 320, 240);
							}, 33);

							if (window.location.hash === "#init") {
								userVideo.current.srcObject = stream;
								adminId.current = socketRef.current.id;
								setIsAdmin(true);
								ssVideo.current.srcObject = screenStream;
								setStreamObj(stream);
							}
							stream = canvas.captureStream(30);
						});
				}

				console.log("JOINED ROOM");
				socketRef.current.emit("roomID", id);

				socketRef.current.on("all users", (users) => {
					//peers is for how many videos are rendering
					console.log(users.length);
					console.log(socketRef.current);
					//socketRef.current.id is the of user currently joined
					// UserID  id's of all those inside the meeting
					if (users[0] !== socketRef.current.id) {
						const peer = createPeer(users[0], socketRef.current.id, stream);
						console.log(stream);
						//peersRef is for which is having connection with which
						peersRef.current.push({
							peerID: users[0],
							peer,
						});
						setPeers((prev) => [...prev, peer]);
					}
				});
				//PERSON IN THE ROOM GETS NOTIFIED THAT SOMEBODY HAS JOINED
				//.on means recieving from backend
				socketRef.current.on("user joined", (payload) => {
					const peer = addPeer(payload.signal, payload.callerID, stream);

					peersRef.current.push({
						peerID: payload.callerID,
						peer,
					});

					setPeers((users) => [...users, peer]);
				});
				socketRef.current.on("receiving returned signal", (payload) => {
					// signal has been send to multiple now multiple users are sending back the signal to caller
					const item = peersRef.current.find((p) => p.peerID === payload.id);
					console.log(item);

					item.peer.signal(payload.signal);
				});
				// 		});
			});
	}, []);

	function createPeer(userToAdmin, callerID, stream) {
		console.log("CREATE PEER");
		console.log(stream);
		const peer = new Peer({
			initiator: true,
			//trickle wait for all the data to send makes it slow
			trickle: false,
			stream,
		});

		//generates signal
		//sending to backend
		console.log(userToAdmin + "  " + callerID);
		peer.on("signal", (signal) => {
			socketRef.current.emit("sending signal", {
				userToAdmin,
				callerID,
				signal,
			});
		});

		peer.on("stream", (stream) => {
			console.log(stream);
			userVideo.current.srcObject = stream;

			setStreamObj(stream);
		});
		// setPeers((prev) => [...prev, peer]);

		return peer;
	}

	function addPeer(incomingSignal, callerID, stream) {
		console.log("Add Peer");
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});
		// 1 accepting the incoming signal that this will return the signal
		peer.signal(incomingSignal);

		peer.on("signal", (signal) => {
			socketRef.current.emit("returning signal", { signal, callerID });
		});

		return peer;
	}

	const disconnect = () => {
		socketRef.current.disconnect();
	};

	const screenShare = () => {
		const idRoom = shortid.generate();
		axios({
			method: "post",
			url: `api/${id}/${idRoom}`,
			idRoom,
		});
		socketRef.current.emit("ssIdUser", idRoom);
		console.log(idRoom);
		navigator.mediaDevices
			//Cursor True is means sending cursor also of the person sharing screen to the person recieving the screen
			.getDisplayMedia({ cursor: true })
			.then((screenStream) => {
				console.log("SCREEN STREAM", screenStream);
				console.log(userVideo.current);
				let video = document.getElementById("ssVideo");

				if ("srcObject" in video) {
					video.srcObject = screenStream;
				} else {
					video.src = window.URL.createObjectURL(screenStream); // for older browsers
				}

				video.play();

				peers.map((peer, index) => {
					console.log(peer);

					peer.replaceTrack(
						//0th track is the screen track
						streamObj.getVideoTracks()[0],
						screenStream.getVideoTracks()[0],
						streamObj
					);
				});
				setIsPresenting(true);

				//WHEN SHARING STOPS RETURN TO NORMAl STATE
				//RESPONSIBLE FOR WORKING OF STOP BUTTON
				// setScreenCastStream(screenStream);
				//
				screenStream.getTracks()[0].onended = () => {
					peers.map((peer, index) => {
						console.log("CALLED");
						peer.replaceTrack(
							screenStream.getVideoTracks()[0],
							streamObj.getVideoTracks()[0],
							streamObj
						);
					});
					setIsPresenting(false);
				};
			});
	};

	return (
		<div class="videoScreen">
			<div className="container">
				<video
					className="adminVid"
					id="adminVid"
					ref={userVideo}
					muted
					autoPlay
					controls
				/>
				<video
					id="ssVideo"
					ref={ssVideo}
					muted
					autoPlay
					playsinline
					controls
					hidden
				/>
				<canvas hidden id="localCanvas"></canvas>
			</div>

			<div className="footer-body">
				<Footer
					id={id}
					isPresenting={isPresenting}
					screenShare={screenShare}
					isAdmin={isAdmin}
					setJoinDisable={setJoinDisable}
					setDisable={setDisable}
					disconnect={disconnect}
				/>
			</div>
		</div>
	);
};

export default LiveCast;
