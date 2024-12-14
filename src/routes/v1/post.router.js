// const {
// 	createPostController,
// 	likeAndUnlikeController,
// 	getAllPostOfFollowings,
// 	deletePostController,
// 	getMyPostsController,
// } = require('../../controllers/post.controller');
// const requireUser = require('../../middleware/requireUser');

const { getAllPostOfFollowings, createPostController, likeAndUnlikeController, deletePostController, getMyPostsController } = require('../../contollers/post.Controller');
const requireUser = require('../../middlewere/requireUser');

const router = require('express').Router();

router.get('/all', requireUser, getAllPostOfFollowings);
router.post('/', requireUser, createPostController);
router.post('/like', requireUser, likeAndUnlikeController);
router.delete('/', requireUser, deletePostController);
router.get('/', requireUser, getMyPostsController);

module.exports = router;
