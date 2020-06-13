const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var leaderSchema = new Schema({
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
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default:false      
    }
},{
    timestamps: true //This will add createtAt and updatedAt timestamp
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;