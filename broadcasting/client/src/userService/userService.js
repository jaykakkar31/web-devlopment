const axios = require("axios");
export const fetchId = () => {
	const response = axios.get("/api");

	return response;
};

export const deleteId = (id) => {
	const response = axios({
		method: "delete",
		url:   `/api/:id`,
		data: { id: id },
	});
	return response;
};
