var express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');

const CategoryControllers = require('../Controllers/CategoryControllers');
const PostControllers = require('../Controllers/PostControllers');



router.get('/', function(req, res, next) {
  res.render('index', { title: 'API' });
});

//category routes
router.get('/category/', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])] , CategoryControllers.getAll);
router.get('/category/:id', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])], CategoryControllers.getOne);
router.post('/category/', [
  authMiddleware,
  roleMiddleware(['ADMIN', 'USER']),
  check('name', 'Login cannot be empty').notEmpty(),
], CategoryControllers.create);
router.delete('/category/:id', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])], CategoryControllers.delete);
router.put('/category/', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])], CategoryControllers.change)


// post routes
router.get('/post/', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])] , PostControllers.getAll);
router.get('/post/:id', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])] , PostControllers.getOne);
router.delete('/post/:id', [ authMiddleware, roleMiddleware(['ADMIN', 'USER'])] , PostControllers.delete);
router.post('/post/', [ 
  authMiddleware,
  roleMiddleware(['ADMIN', 'USER']),
  fileExtLimiter(['.jpg', '.jpeg', '.png']),
  fileSizeLimiter(3)
] , PostControllers.create);
router.put('/post/', [
  authMiddleware,
  roleMiddleware(['ADMIN', 'USER']),
  fileExtLimiter(['.jpg', '.jpeg', '.png']),
  fileSizeLimiter(3)
], PostControllers.change)


module.exports = router;
