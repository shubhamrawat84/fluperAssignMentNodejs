var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    mobile: {
        type: String,
    },
    token: String,
}, {
        timestamps: true,
    }

);
module.exports = mongoose.model('users', UserSchema);