const express = require('express')
const axios = require('axios')
const qs = require('querystring')
const kakao = require('./config/kakao')

const app = express()
app.use(express.json());

app.get('/', function(req, res) {
    const auth = `Bearer ${kakao.token}`
    const text_content = {
        object_type: "text", 
        text: "ICE_ALERT TEST",
        link: {
            "web_url":"http://ice.hufs.ac.kr/", 
            "mobile_web_url": "http://ice.hufs.ac.kr/"
        },
        button_title: "바로 확인"
    }

    let options = {
        url: 'https://kapi.kakao.com/v2/api/talk/memo/default/send',
        method: 'post',
        headers : {
            "Authorization" : auth,
            "Content-Type" : "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
            template_object: JSON.stringify(text_content)
        })
    }

    const send = async() => {
        axios(options)
        .then(function(response) {
            console.log(response.data)
        })
        .catch(function(err){
            console.log(`kakao send msg api err`)
        })
    }
    send()
    res.status(200).json({'msg' : `send msg success`})
})

app.listen(3000)