const { loginController } = require('../../contollers/auth.Controller')
const authRouter = require('./')
const router = require('express').Router()



router.post('/login', loginController )

module.exports = router