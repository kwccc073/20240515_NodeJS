import axios from 'axios'// 用於發請求
import * as cheerio from 'cheerio' // 引入cheerio的固定寫法
// 套件cheerio之功能是在Node.js環境下，使用JQ的語法去解析HTML的文字

// LINE輸入'前端'的指令
export default async (event) => {
  try {
    const { data } = await axios.get('https://wdaweb.github.io/')
    // 固定寫法const $ = cheerio.load('一串HTML')
    const $ = cheerio.load(data)
    const courses = []
    // 不加.each()的話多個文字會串在一起
    $('#fe .card-title').each(function () {
      // .push() 將值加進陣列裡
      // .trim()是把空白拿掉
      courses.push($(this).text().trim())
    })
    // event.reply是promise
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
