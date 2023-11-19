const express = require('express');
const router  = express.Router();
const {signUp,login,getAllUsers} = require('../controllers/users')


router.route('/signup').post(signUp);
router.route('/login').post(login)
router.route('/getAllUsers').get(getAllUsers);
module.exports = router;