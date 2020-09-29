class APIHandler {
  constructor() {}
  getSong(query) {
    // console.log("nco");
    let getURL = window.location.pathname.split("/");
    let getID = getURL[getURL.length-1]
    let getState   = getURL[getURL.length-2]
    //console.log(getID);
     return axios.get(`/playlists/${getState}/${getID}/${query}`)
  }
  getSongList(query) {
    // console.log("nco");
   let getURL = window.location.pathname.split("/");
   let getID = getURL[getURL.length-1]
   let getState   = getURL[getURL.length-2]
    //console.log(getID);
  return axios.get(`/playlists/${getState}/${getID}/add-song/${query}`)
  }
}

export default APIHandler;
