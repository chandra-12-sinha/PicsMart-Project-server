const router = require('express').Router();
const authRouter = require('./auth.route');
const postRouter = require('./post.router');
const userRouter = require('./user.router');

router.use('/auth', authRouter);
router.use('/post', postRouter);
router.use('/user', userRouter);

module.exports = router;
