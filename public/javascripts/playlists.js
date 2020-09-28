/* import APIHandler from "./APIHandler.js";

const songAPI = new APIHandler;


const getBtn = document.querySelectorAll(".add-btn");

getBtn.forEach(btn => {
   btn.addEventListener("click", clickHandler)
});

async function clickHandler (event) {

    let songID = event.target.parentNode.getAttribute("song-id");
   // console.log(event.target.parentNode.getAttribute("song_id"));

   const sendSong = await songAPI.getSongID(songID);

//   console.log(sendSong);
} */