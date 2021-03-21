const mongoose = require("mongoose");
var ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    user_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default : [],
    }],
    IsLiked: {
        type: Number,
        default: 0  //0 by default , 1 for Like product , 2 for unlike Product
    }
}, {
    strict: true,
    timestamps: true,
});
module.exports = mongoose.model('product', ProductSchema);