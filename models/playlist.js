const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playslistSchema = new Schema({
    name : String,
    user: {type: Schema.Types.ObjectId, ref: "User"},
    songs: [String],
    copies: String
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
