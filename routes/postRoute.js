const router = require('express').Router();
const postController = require('../controllers/postController')


router.post('/create', postController.create);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);
router.put('/:id/like', postController.likePost);
router.get('/:id', postController.get);
router.get('/timeline/:userId', postController.timeline);
router.get('/profile/:username', postController.getUserPosts);


module.exports = router;