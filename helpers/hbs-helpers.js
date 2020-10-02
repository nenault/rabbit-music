const hbs = require("hbs");

hbs.registerHelper("isSameId", function (value1, value2, options) {
  if (value1 == value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("isSpotifyLoggedIn", function (value1, options) {
  if (value1) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("timeOrTimes", function (value1) {
  if (value1 > 1) {
    const times = value1 + " times"
    return times
  } else {
    const time = value1 + " time"
    return time
  }
});

hbs.registerHelper('each_upto', function(ary, max, options) {
  if(!ary || ary.length == 0)
      return options.inverse(this);

  var result = [ ];
  for(var i = 0; i < max && i < ary.length; ++i)
      result.push(options.fn(ary[i]));
  return result.join('');
});

hbs.registerHelper("noEmptyTrack", function (ary, options) {
  if(!ary || ary.length == 0)
      return options.inverse(this);

  var result = [ ];
  for(var i = 0; i < ary.length; ++i){
    if (ary[i].items != "") {
      result.push(options.fn(ary[i]));
    }
  }
  return result.join('');
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

hbs.registerHelper("artistDisplay2", function (list) {
  
  if (list.length > 0) {
    const artArr = [];
    for (let i = 0; i < list.length; i++) {
      artArr.push(list[i].name);
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