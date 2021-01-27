const qs = require('querystring')
const axios = require('axios')

exports.setOptions = async(tokens, titles) => {
    let auth = ``
    for(let i = 0; i < tokens.length; i++) {
        auth = `Bearer ${tokens[i].access_token}`
        console.log(`auth : ${auth}`)
        const text_content = {
            object_type: "text", 
            text: `ICE ALERT ${titles}`, 
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
        await sendmsg(options)
    }
}

const sendmsg = async(options) => {
    axios(options)
    .then(function(response) {
        console.log(response.data)
        return true
    })
    .catch(function(err){
        console.log(`kakao send msg api err : ${err}`)
        return false
    })
}