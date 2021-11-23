import "./App.css";
import Home from "./components/home/home";
import Livecast from "./components/liveCast/liveCast";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { fetchId } from "./userService/userService";
import { useEffect, useState } from "react";

function App() {
	const [id, setId] = useState();
	const [disable, setDisable] = useState(false);
	const [joinDisable, setJoinDisable] = useState(true);

	useEffect(() => {
		fetchId().then((roomID) => {
			console.log(roomID.data.length);
			if (roomID.data.length === 0) {
				setDisable(false);
				setJoinDisable(true);
			} else {
				console.log(roomID);

				setId(roomID.data[0]);
				setDisable(true);
				setJoinDisable(false);
			}
		});
	}, []);

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/">
						<Home id={id} disable={disable} joinDisable={joinDisable} />
					</Route>
					<Route exact path="/:id">
						<Livecast setJoinDisable={setJoinDisable} setDisable={setDisable} />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
