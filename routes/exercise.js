const express = require('express');
const router = express.Router();

const exercise_controller = require('../controllers/exercise');

// post exercise info
router.post('/', exercise_controller.exercise_create_post);


module.exports = router;
