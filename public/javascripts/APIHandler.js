class APIHandler {
  constructor() {}
  getSong(query) {
    // console.log("nco");
    let getURL = window.location.pathname.split("/");
    let getID = getURL[getURL.length-1]
    //console.log(getID);
     return axios.get(`/playlists/edit-playlist/${getID}/${query}`)
  }
}

export default APIHandler;
