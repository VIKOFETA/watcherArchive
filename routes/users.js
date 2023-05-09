const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const UserControllers = require('../Controllers/UserControllers');

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


module.exports = router;
