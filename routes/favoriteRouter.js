const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
var authenticate = require('../authenticate');
const cors = require('./cors');

//Declaring Express Router
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((fav) => {
                if (fav != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                }
                else {
                    err = new Error('Not found');
                    err.status = 404;
                    return next(err); //DON't return just the 'err'
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorite.find({ user: req.user._id})
            .then((fav) => {
                if (fav == null) {
                    req.body.user = req.user._id;
                    Favorite.create(req.body)
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err))
                }
                else {
                    req.body.user = req.user._id;
                    fav.push(req.body); //Push is used to insert
                    fav.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err))
                }
            })
            .catch((err) => next(err));
    })

module.exports = favoriteRouter;