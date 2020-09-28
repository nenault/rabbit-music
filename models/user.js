const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,  
    playlist: {type: Schema.Types.ObjectId, ref: "Playlist"},
});

const User = mongoose.model("User", userSchema);

module.exports = User;