const axios = require('axios')
const { html } = require('cheerio')
const cheerio = require('cheerio')
const { crawl_url } = require('../config/crawling')
const { getToday } = require('../lib/libs')

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
        // console.log(data)
        let today_idx = []
        for (let i = 0; i < data.length; i++) {
            if(data[i].date === today){
                console.log('today!')
                today_idx.push(i)
            }
        }
        // console.log(today_idx)
        if(today_idx.length > 0) { // 새로 올라온게 있으면
            // db에 저장된 user에게 msg 전송하는 function
        }
    })
