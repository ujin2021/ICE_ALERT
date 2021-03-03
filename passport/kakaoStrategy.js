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
                if(exUser.dataValues.access_token !== accessToken){
                    await User.update({access_token: accessToken, refresh_token: refreshToken}, {where:{kakao_id:profile.id}})
                }
                done(null, exUser)
            } else{
                console.log('newUser')
                const newUser = await User.create({
                    kakao_id: profile.id,
                    name: profile.username,
                    access_token: accessToken, 
                    refresh_token: refreshToken
                })
                console.log(newUser)
                done(null, newUser)
            }
        } catch(e) {
            console.log(`kakao login err : ${e}`)
            done(e)
        }
    }))
}

