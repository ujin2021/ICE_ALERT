const express = require('express')
const passport = require('passport')
const authrouter = require('./router/authrouter')

const PORT = 3000
const app = express()

app.use(express.json());
app.use(passport.initialize()); 
// app.use(passport.session());

app.use('/auth', authrouter)
app.use("/", function (req, res) {
    res.statusCode = 200; //send the appropriate status code
    res.json({ status: "success", message: "hello", data: {} });
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})