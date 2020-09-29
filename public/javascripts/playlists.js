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
      let getPreview = "";
      if (song.preview_url != null){
        getPreview = song.preview_url;
      }
      const artistsList = artArr.join(", ");
      getSearchField.innerHTML += `<div class="song" song-id="${song.id}">
      <p>${song.name} de ${artistsList}</p>
      <audio controls src="${getPreview}">
          Your browser does not support the
          <code>audio</code> element.
      </audio>
      <form action="" method="post" class="add-to-playlist">
      <input type="submit" value="Add to playlist">
      </form>
  </div>`;
    } else {
      let getPreview = "";
      if (song.preview_url != null){
        getPreview = song.preview_url;
      }
      getSearchField.innerHTML += `<div class="song" song-id="${song.id}">
      <p>${song.name} de ${song.artists[0].name}</p>
      <audio controls src="${getPreview}">
          Your browser does not support the
          <code>audio</code> element.
      </audio>
      <form action="" method="post" class="add-to-playlist">
      <input type="submit" value="Add to playlist">
      </form>
  </div>`;
    }
  });
  const getAdd = document.querySelectorAll(".add-to-playlist");

  getAdd.forEach((btn) => {
    btn.addEventListener("submit", submitAdd);
  });
}

async function submitAdd(event) {
  event.preventDefault();
  let getHidden = document.querySelector("#songs");
  let getArrofSongs = getHidden.value;
  let idAddSong = event.target.parentNode.getAttribute("song-id");
  //console.log(getArrofSongs);

  let newArrofSongs = getArrofSongs + "," + idAddSong;
  //console.log(newArrofSongs);

  const sendNewArr = await songAPI.getSongList(newArrofSongs);

  const getSongsList = document.querySelector(".songs-list");
  getSongsList.innerHTML = "";

  getHidden.value = newArrofSongs;

  sendNewArr.data.forEach((song) => {
    let getPreview = "";
    if (song.preview_url != null){
      getPreview = song.preview_url;
    }
    getSongsList.innerHTML += `<div class="song" song-id="${song.id}">
    <p>${song.name} de ${song.artists[0].name}</p>
    <audio controls src="${getPreview}">
        Your browser does not support the
        <code>audio</code> element.
    </audio>
    <form action="" method="post" class="add-to-playlist">
    <input type="submit" value="Add to playlist">
    </form>
</div>`;
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
