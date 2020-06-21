const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
var authenticate = require('../authenticate');
const cors = require('./cors');

//Declaring Express Router
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(req.user._id)
                //res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .then((favorites) => {
                if (favorites != null) {
                    req.body.user = req.user._id;
                    favorites.push(req.body);
                    favorites.save()
                        .then((favorites) => {
                            Favorite.find({ user: req.user._id })
                                .then((favorites) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorites);
                                })
                        }, (err) => next(err));
                }
                else {
                    req.body.user = req.user._id;
                    Favorite.create(req.body)
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Favorites.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

/* favoritesRouter.route('/:dishId')
 .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
 .get(cors.cors, (req, res, next) => {
 })
 .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
     Favorites.findById(req.user._id)
         .then(favourite => {
             if (!favourite) {
                 favourite.create({
                     user: req.user._id
                 })
             }
             favourite.dishes.push(req.params.dishId)
             favourite.save()
             res.statusCode = 200
             res.setHeader('Content-Type', 'application/json');
             res.json(favorite)
         }, err => next(err))
 })
 .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
     Favorites.findById(req.user._id)
         .then(fovorite => {
             if (favorite.dishes.indexOf(req.params.dishId) !== -1) {
                 favorite.dishes.id(req.params.dishId).remove()
                 favorite.save()
             }
             res.statusCode = 200
             res.setHeader('Content-Type', 'application/json');
             res.json(favorite)
         }, err => next(err))
 })*/

module.exports = favoriteRouter;