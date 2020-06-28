const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //No two documents should have the same field.
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    }
},{
    timestamps: true //This will add createtAt and updatedAt timestamp
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;