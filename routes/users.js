var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const UserControllers = require('../Controllers/UserControllers');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', [ authMiddleware, roleMiddleware(['ADMIN'])] , UserControllers.getAll);
router.get('/:id', [ authMiddleware, roleMiddleware(['ADMIN'])], UserControllers.getOne);
router.post('/', [
  authMiddleware,
  roleMiddleware(['ADMIN']),
  check('login', 'Login cannot be empty').notEmpty(),
  check('password', 'Password mas be min 4 and max 10 chars').isLength({min: 4, max: 10}),
], UserControllers.create);
router.delete('/:id', [ authMiddleware, roleMiddleware(['ADMIN'])], UserControllers.delete);
router.put('/setRole', [ authMiddleware, roleMiddleware(['ADMIN'])], UserControllers.setRole)

// router.get('/', UserControllers.getAll);
// router.get('/:id', UserControllers.getOne);
// router.post('/', UserControllers.create);
// router.delete('/:id',UserControllers.delete);
// router.put('/setRole', UserControllers.setRole)

module.exports = router;
