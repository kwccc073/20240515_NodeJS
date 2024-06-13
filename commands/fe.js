// 引入axios和cheerio
import axios from 'axios'
import * as cheerio from 'cheerio'

// 導出異步函數
// event表示賴機器人收到的事件
export default async (event) => {
  try {
    // 發送 HTTP GET 請求，
    const { data } = await axios.get('https://wdaweb.github.io/')
    const $ = cheerio.load(data)
    const courses = []
    $('#fe .card-title').each(function () {
      courses.push($(this).text().trim())
    })
    const result = await event.reply(courses)
    if (process.env.DEBUG === 'true') {
      console.log(result)
    }
  } catch (error) {
    console.log(error)
    // event.reply()只能用一次
    event.reply('發生錯誤')
  }
}
