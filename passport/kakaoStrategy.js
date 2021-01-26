const passport = require('passport')
const kakao = require('../config/kakao')
const KakaoStrategy = require('passport-kakao').Strategy
const { User } = require('../models')

module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID : kakao.restapi_key,
        callbackURL: kakao.redirect
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try{
            const exUser = await User.findOne({where:{kakao_id:profile.id, name:profile.username}})
            if(exUser){
                console.log('exUser')
                done(null, exUser.dataValues)
            } else{
                console.log('newUser')
                const newUser = await User.create({
                    kakao_id: profile.id,
                    name: profile.username,
                    access_token: accessToken, 
                    refresh_token: refreshToken
                })
                done(null, newUser)
            }
        } catch(e) {
            console.log(`kakao login err : ${e}`)
            done(e)
        }
    }))
}

