const axios = require('axios')
const { html } = require('cheerio')
const cheerio = require('cheerio')
const { get } = require('https')
const { userInfo } = require('os')
const { crawl_url } = require('../config/crawling')
const { getToday } = require('../lib/libs')
const { executeMsg } = require('./sendmsg')

// ice 홈페이지 게시판 crawling
const getHtml = async() => {
    try{
        return await axios.get(crawl_url)
    } catch(e) {
        console.log('axios err : ', e)
    }
}

// crawling한 내용 정리
const crawling = async() => {
    try {
        let html = await getHtml()
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
    }
    catch(e) {
        console.log('crawling err : ', e)
    }
}

// 오늘 날짜에 해당하는 것이 있으면 해당 게시물을 return
const checkToday = async(data) => {
    const today = await getToday()
    let posts = []
    for (let i = 0; i < data.length; i++) {
        // console.log(`data[i].date : ${data[i].date}, today : ${today}`)
        if(data[i].date === today){
            // console.log('today!')
            posts.push(data[i].title)
        }
    }
    // console.log(`today posts : ${posts}`)
    if(posts.length > 0) { // 새로 올라온게 있으면
        return posts
    } else {
        return false
    }
}

const execute = async() => {
    await getHtml()
    const data = await crawling()
    let post = await checkToday(data)
    if(post) {
        console.log(post)
        return executeMsg(post)
    }
}

execute()