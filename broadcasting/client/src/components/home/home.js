import "./home.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { useEffect } from "react";


const shortid = require("shortid");

const Home = ({id,disable,joinDisable}) => {

	const history = useHistory();
	const idRoom =  shortid.generate();

// window.location.reload()

	return (
		<div className="header">
			<Button
				variant="primary"
				size="lg"
				disabled={disable}
				onClick={() => {
					history.push(`${idRoom}#init`);
				}}
			>
				Create Broadcast
			</Button>
			<Button
				variant="primary"
				size="lg"
				disabled={joinDisable}
				onClick={() => {
					history.push(`/${id}`);
				}}
			>
				Join Now
			</Button>
		</div>
	);
};

export default Home;
