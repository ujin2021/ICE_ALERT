const axios = require('axios')
const { html } = require('cheerio')
const cheerio = require('cheerio')
const { userInfo } = require('os')
const { crawl_url } = require('../config/crawling')
const { getToday } = require('../lib/libs')
const { User } = require('../models')
const { setOptions } = require('../sendmsg')

const getHtml = async() => {
    try{
        return await axios.get(crawl_url)
    } catch(err) {
        console.log('axios err : ', err)
    }
}

getHtml()
    .then(html => {
        let postList = []
        const $ = cheerio.load(html.data)
        const $bodyList = $("div.list form table tbody").children("tr")
        $bodyList.each(function(i, elem){
            if($(this).find('td.no span').text().trim()) { // 공지가 아닌 것(no이 있는 것)
                postList[i] = {
                    no: $(this).find('td.no span').text().trim(),
                    title: $(this).find('td.title a').text().trim(),
                    date: $(this).find('td').text().replace(/(\s*)/g, "").replace("정보통신공학과", " ").split(' ')[1].substr(0,10)
                }
            }
        })
        postList = postList.filter(function(item) {
            return item !== null && item !== undefined && item !== '';
        });
        const data = postList
        return data
    })
    .then(async(data) => {
        const today = await getToday()
        // const today = '2021-01-27'
        console.log(data)
        let posts = []
        for (let i = 0; i < data.length; i++) {
            console.log(`data[i].date : ${data[i].date}, today : ${today}`)
            if(data[i].date === today){
                console.log('today!')
                posts.push(data[i].title)
            }
        }
        console.log(`today posts : ${posts}`)
        if(posts.length > 0) { // 새로 올라온게 있으면
            const tokens = await User.findAll({attributes: ['access_token']})
            // console.log(tokens[0].access_token)
            await setOptions(tokens, posts)
        }
    })
