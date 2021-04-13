const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    bio: {type: String},
    image: {type: String}
});

module.exports = mongoose.model("Publisher", publisherSchema);