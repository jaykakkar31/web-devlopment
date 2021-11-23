import "./footer.css";
import PhoneEnabledIcon from "@material-ui/icons/PhoneEnabled";
import { useHistory } from "react-router-dom";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import { deleteId } from "../../../userService/userService";

const Footer = ({ id, isAdmin, screenShare, isPresenting,disconnect }) => {
	const history = useHistory();
	console.log(isAdmin);
	return (
		<div className="footer-block">
			<div
				className="icon-block phone"
				onClick={() => {
					if (window.location.hash === "#init") {
						deleteId(id);
					}
                    disconnect()
					history.push("/");
				}}
			>
				<PhoneEnabledIcon />
			</div>
			{isAdmin && (
				<div
					className="icon-block screen-share"
					onClick={() => {
						screenShare();
					}}
				>
					<DesktopWindowsIcon />
					{isPresenting ? (
						<p className="title">Stop now</p>
					) : (
						<p className="title">Present now</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Footer;
