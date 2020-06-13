const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

var promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true //Mo two documents should have the same field.
    },
    description: {
        type: String,
        required: true
    },
    image: {
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

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;