var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const CategoryControllers = require('../Controllers/CategoryControllers');


router.get('/category/', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])] , CategoryControllers.getAll);
router.get('/category/:id', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])], CategoryControllers.getOne);
router.post('/category/', [
  authMiddleware,
  roleMiddleware(['ADMIN', 'USER']),
  check('name', 'Login cannot be empty').notEmpty(),
], CategoryControllers.create);
router.delete('/category/:id', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])], CategoryControllers.delete);
router.put('/category/', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])], CategoryControllers.change)



module.exports = router;
