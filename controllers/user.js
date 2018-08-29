const User = require('../models/user');
const Exercise = require('../models/exercise');

// get express-validator functions we need
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.user_create_post = [
  // Validate fields.
  body('username').isLength({ min: 1 }).trim().withMessage('User name must be specified.'),


  // Sanitize fields.
  sanitizeBody('username').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(req.body.username);
    console.log(errors);

    // Create a user object from escaped and trimmed data.
    const user = new User(
      { name: req.body.username}
    );


    if(!errors.isEmpty()) {
      // There are some errors in the validation
      res.json({'validation errors': errors});
      return;
    }
    else {
      // We have valid data from the form

      // Check if user already exists
      User.findOne({'name': req.body.username})
        .exec( function(err, found_user){
          if(err) { return next(err); }

          if(found_user) {
          // User already exists
            res.json({'user exists': req.body.username});
          }
          else {
          // User unique save to database
            user.save((err) =>{
              if(err) { return next(err) }
          // User saved Redirect to index page
              res.json({'saved user': req.body.username, 'id': user._id});
            });
          }
        })

    }

  }

];

// Handle exercise list on get
exports.user_get_exercise_log = (req, res, next) => {
  if(req.query.from && req.query.to) {
    var myQuery = Exercise.find({
      userId: req.query.userId,
      date:{$gt:req.query.from, $lt: req.query.to}
      }, '-userId -__v -_id');
  }
  else  if(req.query.from) {
    var myQuery = Exercise.find({
      userId: req.query.userId,
      date:{$gt:req.query.from}
      }, '-userId -__v -_id');

  }
  else  {
     var myQuery = Exercise.find({
       userId: req.query.userId
     }, '-userId -__v -_id');

   }
  //Adventure.findOne({ type: 'iphone' }).select('name').lean().exec(callback);
     User.findOne({_id: req.query.userId}).select('name').
       exec((err, id) => {
       if(err) { return next(err);}
       // Successful find so add name to req obj
       req.username = id.name;
     })


    myQuery
    .exec((err, logs) => {
      if(err) { return next(err); }
      // Successful find so format output
      var formattedResult = logs.map(obj => {
        const rObj = {
        "description":obj.description,
        "duration": obj.duration,
        "date": new Date(obj.date).toDateString()
        };
        return rObj;
      })
      var count = formattedResult.length;
      // send formatted results in json
      res.json({'username': req.username,'_id':req.query.userId, 'from': req.query.from, 'to': req.query.to, 'count': count, 'log': formattedResult});
    });

  }
