const Exercise = require('../models/exercise');

// get express-validator functions we need
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Handle exercise create on post
exports.exercise_create_post = [

  // Validate fields.
  body('userId').isLength({ min: 1 }).trim().withMessage('User id must be specified.'),
  body('description', 'description must be specified').isLength({ min: 1 }).trim(),
  body('duration', 'duration must be specified').isInt(),
  body('date', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),



  // Sanitize fields.
  sanitizeBody('userId').trim().escape(),
    sanitizeBody('description').trim().escape(),
    sanitizeBody('duration').trim().escape(),
    sanitizeBody('date').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    console.log(body('userid'));
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a exercise object from escaped and trimmed data.
    const exercise = new Exercise(
      { userId: req.body.userId,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date
      }
    );


    if(!errors.isEmpty()) {
      // There are some errors in the validation
      res.json({'validation errors': errors.array()[0].msg});
      return;
    }
    else {
      // We have valid data from the form save to database
        exercise.save((err) =>{
          if(err) { return next(err) }
      // User saved send confirmation
          res.json({'Exercise saved to ID': req.body.userId, 'Description': req.body.description});
        });



    }

  }

];
