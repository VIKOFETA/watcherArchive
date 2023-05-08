const express = require('express');
const router = express.Router();
const { check } = require('express-validator');


const AuthControllers = require('../Controllers/AuthControllers');

router.post('/login', AuthControllers.login);
router.post('/registration', [
  check('login', 'Login cannot be empty').notEmpty(),
  check('password', 'Password mas be min 4 and max 10 chars').isLength({min: 4, max: 10}),
], AuthControllers.registration);
// router.get('/', (req, res) => {
//   try {
//     res.status(200).json('login', req.body);
//   } catch(e) {
//     res.status(500).json('Registration error', e);
//   }
// });

module.exports = router;
