const router = require('express').Router()
const authRouter = require('./auth.route')
const postRouter = require('./post.router')

router.use("/auth", authRouter)
router.use("/post", postRouter)

module. exports = router