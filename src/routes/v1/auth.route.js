const { loginController, signUplController, refreshAccessTokenController } = require('../../contollers/auth.Controller')
const authRouter = require('./')
const router = require('express').Router()



router.post('/login', loginController )
router.post("/signup",signUplController)
router.get('/refreshtoken', refreshAccessTokenController)

module.exports = router