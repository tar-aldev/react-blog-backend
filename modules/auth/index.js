const router = require('express').Router()
const controller = require('./auth.controller')

router.post('/signin', controller.signin)
router.post('/signin-google', controller.googleSignin)
router.get('/google-signin-url', controller.googleSigninUrl)

module.exports = router
