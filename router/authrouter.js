const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/kakao', passport.authenticate('kakao'))
router.get('/kakao/callback', passport.authenticate('kakao', {
   failureRedirect: '/failed'
}), (req, res) => {
    res.redirect('/success')
})

module.exports = router