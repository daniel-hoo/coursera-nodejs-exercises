var express = require('express');
var bodyParser = require('body-parser');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({
        postedBy: req.decoded._doc._id
      })
      .populate('postedBy')
      .populate('dishes')
      .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
      });
  })

  .post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({
        postedBy: req.decoded._doc._id
      })
      .exec(function (err, favorite) {
        if (err) throw err;
        if (!favorite) { //favorites document does not exist 
          Favorites.create({
            postedBy: req.decoded._doc._id
          }, function (err, favorite) {
            if (err) throw err;
            favorite.dishes.push(req.body._id);
            favorite.save(function (err, favorite) {
              if (err) throw err;
              console.log('Posted Favorite!');
              res.json(favorite);
            });
          });
        } else { //favorites document exists
          if (favorite.dishes.indexOf(req.body._id) < 0) { //dish does not exist
            favorite.dishes.push(req.body._id);
            favorite.save(function (err, favorite) {
              if (err) throw err;
              console.log('Added Favorite Dish!');
              res.json(favorite);
            });
          } else {//dish already exists
            console.log('Favorite Dish Already Exits!');
            res.json(favorite);
          }
        }
      });
  })

  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.remove({
      postedBy: req.decoded._doc._id
    }, function (err, resp) {
      if (err) throw err;
      res.json(resp);
    });
  });

favoriteRouter.route('/:dishId')
  .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({
        postedBy: req.decoded._doc._id
      })
      .exec(function (err, favorite) {
        if (err) throw err;
        if (favorite) {
          var index = favorite.dishes.indexOf(req.params.dishId);
          if (index >= 0) {
            favorite.dishes.splice(index, 1); //delete the dish
            favorite.save(function (err, favorite) {
              if (err) throw err;
              console.log('Deleted Dish!');
              res.json(favorite);
            });
          } else {
            console.log('No Such Dish!');
            res.json(favorite);
          }
        } else {
          console.log('No Favorites!');
          res.json(favorite);
        }
      });
  });

module.exports = favoriteRouter;
