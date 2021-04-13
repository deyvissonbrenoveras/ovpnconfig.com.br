const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    heading: {type: String},
    subheading: {type: String},
    content: {type: String},
    headingImage: {type: String},   
    url: {type: String},
    published: {type: Boolean, default: false},
    creationDate: {type: Date, default: Date.now},
    lastUpdate: {type: Date, default: Date.now},
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publisher"
    }
});

module.exports = mongoose.model("Post", postSchema);