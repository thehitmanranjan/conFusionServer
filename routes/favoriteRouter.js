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
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ 'user': req.user._id })
            .then((fav) => {
                if (fav.length == 0 || fav == undefined || fav == null || fav === []) {
                    Favorite.create({ user: req.user._id, dishes: [] })
                        .then((fav) => {
                            for (i in req.body) {
                                fav.dishes.push(req.body[i]._id)
                            }
                            fav.save()
                                .then((fav) => {
                                    Favorite.findById(fav._id)
                                        .populate('user')
                                        .populate('dishes')
                                        .then((fav) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(fav);
                                        })
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
                else {
                    console.log(fav);
                    for (i in req.body) {
                        fav[0].dishes.push(req.body[i]._id)
                    }
                    fav[0].save()
                        .then((fav) => {
                            Favorite.findById(fav._id)
                                .populate('user')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                })
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.deleteOne({ 'user': req.user._id })
            .then((fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ "exists": false, "favorites": favorites });
                }
                else {
                    if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": false, "favorites": favorites });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": true, "favorites": favorites });
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ 'user': req.user._id })
            .then((fav) => {
                if (fav.length == 0 || fav == undefined || fav == null || fav === []) {
                    Favorite.create({ user: req.user._id, dishes: [] })
                        .then((fav) => {
                            fav.dishes.push(req.params.dishId)
                            fav.save()
                                .then((fav) => {
                                    Favorite.findById(fav._id)
                                        .populate('user')
                                        .populate('dishes')
                                        .then((fav) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(fav);
                                        })
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
                else {
                    var flag = false;
                    for (i in fav[0].dishes) {
                        console.log(fav[0].dishes[i])
                        if (fav[0].dishes[i] == req.params.dishId) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag == true) {
                        res.statusCode = 403;
                        res.end('Dish already exists');
                    }
                    else {
                        fav[0].dishes.push(req.params.dishId)
                        fav[0].save()
                            .then((fav) => {
                                Favorite.findById(fav._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then((fav) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(fav);
                                    })
                            }, (err) => next(err))
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/:dishId');
    })
    .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ 'user': req.user._id })
            .then((fav) => {
                if (fav.length == 0 || fav == undefined || fav == null || fav === []) {
                    res.statusCode = 404
                    res.end('No favourites found for user')
                }
                else {
                    var flag = false;
                    for (i in fav[0].dishes) {
                        if (fav[0].dishes[i] == req.params.dishId) {
                            fav[0].dishes.splice(i, 1);
                            fav[0].save()
                                .then((fav) => {
                                    Favorite.findById(fav._id)
                                        .populate('user')
                                        .populate('dishes')
                                        .then((fav) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(fav);
                                        })
                                })
                            flag = true;
                            break;
                        }
                    }
                    if (flag == false) {
                        res.statusCode = 404
                        res.setHeader('Content-type', 'application/json');
                        res.end("Dish not found");
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = favoriteRouter;