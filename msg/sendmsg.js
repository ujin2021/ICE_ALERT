const qs = require('querystring')
const axios = require('axios')
const { User } = require('../models')
const { restapi_key } = require('../config/kakao')

const getToken = async(type) => {
    if(type === 'refresh') {
        const refresh = await User.findAll({attributes:['refresh_token']})
        return refresh
    } else if(type === 'access') {
        const access = await User.findAll({attributes:['access_token']})
        return access
    }
}

const updateToken = async(refresh_token) => {
    try{
        console.log('refresh token : ', refresh_token)
        renew_url = 'https://kauth.kakao.com/oauth/token'
        const n = refresh_token.length
        for (let i = 0; i < n; i++) {
            let options = {
                url: renew_url,
                method: 'post',
                headers : {
                    "Content-Type" : "application/x-www-form-urlencoded;charset=utf-8"
                },
                data: qs.stringify({
                    grant_type: 'refresh_token',
                    client_id: `${restapi_key}`,
                    refresh_token: `${refresh_token[i].refresh_token}`
                })
            }
            await axios(options)
                .then(async function(response) {
                    const res = response.data
                    let new_access = res.access_token
                    if(res.refresh_token !== undefined) {
                        let new_refresh = res.refresh_token
                        await User.update({access_token: new_access, refresh_token: new_refresh}, {where:{refresh_token:refresh_token[i].refresh_token}})
                    } else {
                        await User.update({access_token: new_access}, {where:{refresh_token:refresh_token[i].refresh_token}})
                    }
            })
        }
    } catch(e) {
        console.log('renew err : ', e)
    }
}

const sendMsg = async(access_token, post) => {
    try {
        let auth = ``
        const n = access_token.length
        for(let i = 0; i < n; i++) {
            auth = `Bearer ${access_token[i].access_token}`
            const text_content = {
                object_type: "text", 
                text: `[ICE ALERT] ${post}`, 
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
            await axios(options)
                .then(async function(response) {
                    console.log(response.data)
            })
        }
    } catch (e) {
        console.log('sendMsg err : ', e)
    }
}

exports.executeMsg = async(post) => {
    try {
        const refresh = await getToken('refresh')
        await updateToken(refresh)
        const access = await getToken('access')
        await sendMsg(access, post)
    } catch(e) {
        console.log('executeMsg err : ', e)
    }
}