const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  name: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  songs: [String],
  copies: {
    type: String,
    default: 0,
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
