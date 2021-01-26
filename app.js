const express = require('express')
const passport = require('passport')
const passportConfig = require('./passport')
passportConfig(passport)
const authrouter = require('./router/authrouter')
const mainrouter = require('./router/mainrouter')
const { sequelize } = require('./models/index')
const session = require("express-session");
const { secret } = require('./config/kakao')

const app = express()
sequelize.sync()

app.use(express.json());

app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie:{ httpOnly: true, secure: false, }
}))
app.use(passport.initialize());
app.use(passport.session())

app.use("/", mainrouter)
app.use('/auth', authrouter)


const PORT = 3000
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})