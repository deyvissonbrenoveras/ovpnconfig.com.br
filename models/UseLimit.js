const mongoose = require("mongoose");

const useLimitSchema = mongoose.Schema({
    ip: {type: String},
    date: {type: Date},    
});

module.exports = mongoose.model("UseLimit", useLimitSchema);