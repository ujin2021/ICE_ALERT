const passport = require('passport')
const kakao = require('./kakaoStrategy')
const { User } = require('../models')

module.exports = (passport) => {
    // req.session 객체에 어떤 데이터를 저장할 지 선택
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    // 매 요청시 실행. session에 저장했던 아이디를 받아 db에서 사용자 정보 조회
    // 조회한 정보는 req.user에 저장
    passport.deserializeUser((id, done) => {
        User.findOne({where:{id}})
            .then(user => done(null, user))
            .catch(err => done(err))
    })
    kakao(passport)
}