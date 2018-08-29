const express = require('express');
const router = express.Router();

const user_controller  = require('../controllers/user');

// List users log by id
router.get('/log', user_controller.user_get_exercise_log);
// post user info
router.post('/new-user', user_controller.user_create_post);


module.exports = router;
