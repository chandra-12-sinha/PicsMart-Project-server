// const { getAllPostsController } = require('../../controllers/post.controller');
const { getAllPostsController } = require('../../contollers/post.Controller');
const requireUser = require('../../middlewere/requireUser');
// const requireUser = require('../../middlewares/requireUser');
const router = require('express').Router();

getAllPostsController
router.get('/all', requireUser, getAllPostsController);
module.exports = router;