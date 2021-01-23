const express = require('express')
const router = express.Router()
const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const kakao = require('../config/kakao')

passport.use('kakao', new KakaoStrategy({
    clientID : kakao.restapi_key,
    callbackURL: kakao.redirect
}, 
async (accessToken, refreshToken, profile, done) => {
    try{
        console.log(accessToken, refreshToken, profile)
    } catch(e) {
        console.log(`kakao login err : ${e}`)
        done(e)
    }
}))

router.get('/kakao', passport.authenticate('kakao'))
router.get('/kakao/callback', passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/',
}), (req, res) => {
    console.log(`req : ${req}`)
    res.redirect('/')
})

module.exports = router