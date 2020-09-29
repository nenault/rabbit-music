import APIHandler from "./APIHandler.js";

const songAPI = new APIHandler();

//("playlists/edit-playlist/{{playlist._id}}/delete-song");

const getDeleteBtn = document.querySelectorAll(".delete-song");

getDeleteBtn.forEach((btn) => {
  btn.addEventListener("click", submitDelete);
});

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

    //console.log(song.album.images);

    if (song.artists.length > 1) {
      const artArr = [];
      for (let i = 0; i < song.artists.length; i++) {
        artArr.push(song.artists[i].name);
      }
      // console.log(artArr);
      let getPreview = "";
      if (song.preview_url != null) {
        getPreview = song.preview_url;
      }
      const artistsList = artArr.join(", ");

      getSearchField.innerHTML += `
      <div class="song" song-id="${song.id}">
      <img src="${song.album.images[1].url}" alt="" class="imgsong">
      <h2>${song.name}</h2> <h3>${artistsList}</h3>
      <audio class="player" controls src="${getPreview}">
          Your browser does not support the
          <code>audio</code> element.
      </audio>
      <form action="" method="post" class="add-to-playlist">
      <input type="submit" value="Add to playlist">
      </form>
  </div>`;
    } else {
      let getPreview = "";
      if (song.preview_url != null) {
        getPreview = song.preview_url;
      }
      getSearchField.innerHTML += `<div id="songcontainer"><div class="song" song-id="${song.id}">
      <img src="${song.album.images[1].url}" alt="" class="imgsong">
      <h2>${song.name}</h2> <h3>${song.artists[0].name}</h3>
      <audio class="player" controls src="${getPreview}">
          Your browser does not support the
          <code>audio</code> element.
      </audio>
      <form action="" method="post" class="add-to-playlist">
      <input type="submit" value="Add to playlist">
      </form>
  </div></div>`;
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
    if (song.preview_url != null) {
      getPreview = song.preview_url;
    }
    getSongsList.innerHTML += `<div class="song" song-id="${song.id}">
    <p>${song.name} de ${song.artists[0].name}</p>
    <audio controls src="${getPreview}">
        Your browser does not support the
        <code>audio</code> element.
    </audio>
    <p song-id="${song.id}" class="delete-song">Delete</p>
</div>`;
    const getDeleteBtn = document.querySelectorAll(".delete-song");
    getDeleteBtn.forEach((btn) => {
      btn.addEventListener("click", submitDelete);
    });
  });
}

async function submitDelete(event) {
  let idDeleteSong = event.target.getAttribute("song-id");
  //console.log(idDeleteSong);

  let getHidden = document.querySelector("#songs");
  let getArrofSongs = getHidden.value;

  let newArrayofSongs = getArrofSongs.split(",");
  // let newArrofSongs = getArrofSongs - idDeleteSong;

  //console.log(newArrayofSongs);

  let filteredArray = newArrayofSongs.filter(function (value, index, arr) {
    return value != idDeleteSong;
  });

  //console.log(filteredArray.length);
  const newListofSongs = filteredArray.join(",");
  //console.log(newListofSongs);

  const sendNewArrofSongs = await songAPI.getSongList(newListofSongs);

  const getSongsList = document.querySelector(".songs-list");
  getSongsList.innerHTML = "";

  getHidden.value = newListofSongs;
  //console.log(sendNewArrofSongs.data.length);

  sendNewArrofSongs.data.forEach((song) => {
    let getPreview = "";
    if (song.preview_url != null) {
      getPreview = song.preview_url;
    }
    getSongsList.innerHTML += `<div class="song" song-id="${song.id}">
    <p>${song.name} de ${song.artists[0].name}</p>
    <audio controls src="${getPreview}">
        Your browser does not support the
        <code>audio</code> element.
    </audio>
    <p song-id="${song.id}" class="delete-song">Delete</p>
</div>`;
    const getDeleteBtn = document.querySelectorAll(".delete-song");
    getDeleteBtn.forEach((btn) => {
      btn.addEventListener("click", submitDelete);
    });
  });
}
