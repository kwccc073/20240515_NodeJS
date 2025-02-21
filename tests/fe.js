// 此檔案用於測試資料夾commands裡的檔案可否使用
// 1. 將commands裡有的export default拿掉
// 2. 輸入指令 npx nodemon tests/此檔案名稱 即可測試
import axios from 'axios'
// 引入套件cheerio，功能為在Node.js環境下使用JQuery的語法來解析HTML文字
import * as cheerio from 'cheerio'

const main = async () => {
  try {
    const { data } = await axios.get('https://wdaweb.github.io/')
    const $ = cheerio.load(data)
    const courses = []
    $('#fe .card-title').each(function () {
      courses.push($(this).text().trim())
    })
    console.log(courses)
  } catch (error) {
    console.log(error)
  }
}

main()
