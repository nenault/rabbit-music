class APIHandler {
  constructor() {}
  getSong(query) {
    let getURL = window.location.pathname.split("/");
    let getID = getURL[getURL.length-1]
    let getState   = getURL[getURL.length-2]
     return axios.get(`/playlists/${getState}/${getID}/${query}`)
  }
  getSongList(query) {
   let getURL = window.location.pathname.split("/");
   let getID = getURL[getURL.length-1]
   let getState   = getURL[getURL.length-2]
  return axios.get(`/playlists/${getState}/${getID}/add-song/${query}`)
  }
}

export default APIHandler;
