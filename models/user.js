const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,  
    playlist: {type: Schema.Types.ObjectId, ref: "Playlist"},
    role : {
        type : String,
        default : "user"
    },
    spotifyid : String,
    code: String,
    isSpotify : {
        type : Boolean,
        default : "false"
    },
    spotify: [{}]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
