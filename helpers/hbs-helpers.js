const hbs = require("hbs");

hbs.registerHelper("isSameId", function (value1, value2, options) {
  if (value1 == value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("imageDisplay", function (value1) {
  let length = value1.length;
  let image = value1[length-2].url;
  return image
})

hbs.registerHelper("artistDisplay", function (list) {
  if (list.length > 1) {
    const artArr = [];
    for (let i = 0; i < list.length; i++) {
      artArr.push(list[i]);
    }
    const artistsList = artArr.join(", ");
    return artistsList;
  }
})

/* if (song.artists.length > 1) {
  const artArr = [];
  for (let i = 0; i < song.artists.length; i++) {
    artArr.push(song.artists[i].name);
  }
  // console.log(artArr);
  let getPreview = "";
  if (song.preview_url != null) {
    getPreview = song.preview_url;
  }
  const artistsList = artArr.join(", "); */