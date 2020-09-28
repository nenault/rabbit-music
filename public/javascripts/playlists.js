import APIHandler from "./APIHandler.js";

const songAPI = new APIHandler();

const getSearchField = document.querySelector("#search-result");
const getForm = document.getElementById("searchBox");
getForm.addEventListener("submit", submitHandler);

async function submitHandler(event) {
  event.preventDefault();
  const getInput = document.querySelector("#song-search");

  const sendValue = await songAPI.getSong(getInput.value);

  getSearchField.innerHTML = "";

  sendValue.data.forEach((song) => {
    let getArtistsArr = song.artists;

    if (song.artists.length > 1) {
      const artArr = [];
      for (let i = 0; i < song.artists.length; i++) {
        artArr.push(song.artists[i].name);
      }
     // console.log(artArr);
      const artistsList = artArr.join(", ");
      getSearchField.innerHTML += `<div class="song">
      <p>${song.name} de ${artistsList}</p>
      <audio controls src="${song.preview_url}">
          Your browser does not support the
          <code>audio</code> element.
      </audio>
  </div>`;
    } else {
      getSearchField.innerHTML += `<div class="song">
      <p>${song.name} de ${song.artists[0].name}</p>
      <audio controls src="${song.preview_url}">
          Your browser does not support the
          <code>audio</code> element.
      </audio>
  </div>`;
    }
  });
}

/* const getBtn = document.querySelectorAll(".add-btn");

getBtn.forEach(btn => {
   btn.addEventListener("click", clickHandler)
});

async function clickHandler (event) {

    let songID = event.target.parentNode.getAttribute("song-id");
   // console.log(event.target.parentNode.getAttribute("song_id"));

   const sendSong = await songAPI.getSongID(songID);

//   console.log(sendSong);
} */
