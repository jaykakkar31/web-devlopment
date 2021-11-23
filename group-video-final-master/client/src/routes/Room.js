import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
	padding: 20px;
	display: flex;
	height: 100vh -90px;
	width:100vw;
	${'' /* margin: auto; */}
	flex-wrap: wrap;
`;

const StyledVideo = styled.video`
	height: 40%;
	width: 50%;
`;

const Video = (props) => {
	const ref = useRef();

	useEffect(() => {
		console.log(props.peer);
		props.peer.on("stream", (stream) => {
			console.log("ENTE0RD" + stream);
			ref.current.srcObject = stream;
		});
	}, []);

	return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2,
};

const Room = (props) => {
	const [peers, setPeers] = useState([]);
	const socketRef = useRef();
	const userVideo = useRef();
	const peersRef = useRef([]);
	const roomID = props.match.params.roomID;

	useEffect(() => {
		socketRef.current = io.connect("/");
		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				userVideo.current.srcObject = stream;
				console.log("USERVIDEO" +stream);
				socketRef.current.emit("join room", roomID);
				socketRef.current.on("all users", (users) => {
					const peers = [];
					users.forEach((userID) => {
						console.log(userID + " USER ID OF USER IN THE ROOM ");
						const peer = createPeer(userID, socketRef.current.id, stream);
						peersRef.current.push({
							peerID: userID,
							peer,
						});
						peers.push(peer);
					});
					setPeers(peers);
					console.log(peers);
				});

				socketRef.current.on("user joined", (payload) => {
					const peer = addPeer(payload.signal, payload.callerID, stream);
					peersRef.current.push({
						peerID: payload.callerID,
						peer,
					});

					setPeers((users) => [...users, peer]);
					console.log(peers);
				});

				socketRef.current.on("receiving returned signal", (payload) => {
					const item = peersRef.current.find((p) => p.peerID === payload.id);
					console.log(item);
					item.peer.signal(payload.signal);
				});
			});
	}, []);

	function createPeer(userToSignal, callerID, stream) {
		console.log("CREATE PEER");

		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on("signal", (signal) => {
			socketRef.current.emit("sending signal", {
				userToSignal,
				callerID,
				signal,
			});
		});

		return peer;
	}

	function addPeer(incomingSignal, callerID, stream) {
        console.log("ADD PEER");
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});

		peer.on("signal", (signal) => {
			socketRef.current.emit("returning signal", { signal, callerID });
		});

		peer.signal(incomingSignal);

		return peer;
	}

	// console.log("PEERS " + JSON.stringify(peers));
	return (
		<Container>
			<StyledVideo muted ref={userVideo} autoPlay playsInline />
			{peers.map((peer, index) => {
				return <Video key={index} peer={peer} />;
			})}
		</Container>
	);
};

export default Room;
