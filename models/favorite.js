const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user :{
        unique : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    dishes:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Dish'
    }]
}, {
    timestamps: true
});

var Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;