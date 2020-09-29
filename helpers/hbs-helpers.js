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
  let image = value1[length-1];
  return image
})

