const qs = require('querystring')
const axios = require('axios')

exports.setOptions = async(tokens, titles) => {
    let auth = ``
    for(let i = 0; i < tokens.length; i++) {
        // token 먼저 체크 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#refresh-token (토큰정보보기)
        // 401이면 refresh token 이용해서 다시받기
        // refesh token이 곧 만료되면 msg로 다시 로그인해달라고 알림 주기
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
        let status = err.response.status
        return false
    })
}