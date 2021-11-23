const axios = require("axios");
const { mainUrl } = require("./");
const noteUrl = mainUrl + "api/notes";

export const getNotes = (teamId) =>
  axios({
    method: "GET",
    url: `${noteUrl}/${teamId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

export const createNotes = (body) =>
  axios({
    method: "POST",
    url: `${noteUrl}`,
    data: body,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });
