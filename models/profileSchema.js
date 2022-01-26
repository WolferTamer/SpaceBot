const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    serverID: {type: String, require: true},
    coins:  {type: Number, default: 1000},
    bank: {type: Number},
    resources: {type: Map, of: Number},
    items: {type: Map, of: Number},
    equipped: {type: String},
    timeAutoStarted: {type: Number},
    autoToComplete: {type: Number},
    autoStats: {type: Map, of: Number},
    fbmuted: {type: Boolean},
    lastDaily: {type: Date},
    dailyStreak: {type: Number}
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;