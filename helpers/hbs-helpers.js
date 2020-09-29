const hbs = require("hbs");

hbs.registerHelper("isSameId", function (value1, value2, options) {
  if (value1 == value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

