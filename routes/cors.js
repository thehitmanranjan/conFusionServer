const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443','http://DESKTOP-05NLIP1:3001'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) { //To check if the incoming request's origin is in the whitelist
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors(); //for GET, some POSTS etc.
exports.corsWithOptions = cors(corsOptionsDelegate); // for PUT, DELETE, Some OSTS etc.