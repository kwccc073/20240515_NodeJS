// 引入套件
import axios from 'axios'
// 引入計算距離的工具檔案
import { distance } from '../utils/distance.js'
// LINE訊息的模板
import template from '../templates/taiwangods.js'
// node: 表示node js內建的套件
// fs用於檔案處理，可以讀也可以寫，當訊息模板掛掉時可用來把模板的JSON印出來
import fs from 'node:fs'

export default async (event) => {
  try {
    // URLSearchParams()讓你可以方便地解析、操作和構建URL的查詢字符串。（特定資料型態才會用到）
    const { data } = await axios.post(
      'https://taiwangods.moi.gov.tw/Control/SearchDataViewer.ashx?t=landscape',
      new URLSearchParams({
        lang: 1,
        area: '',
        rtype: '',
        festival: '',
        keyWord: '',
        festival_s: '',
        festival_e: ''
      })
    )
    /* .map() 可參考上課影片02:30:34
       用來對陣列中每個元素進行處理，並返回一個新的陣列。*/
    const replies = data
      .map((d) => {
        // 對陣列每個東西(d)裡面加上distance欄位，distance為函式，其使用的值如下方括弧
        d.distance = distance(
          // 景點的經緯度
          d.L_MapY,
          d.L_MapX,
          // 使用者傳的經緯度
          event.message.latitude,
          event.message.longitude,
          // 使用者離景點距離（公里）
          'K'
        )
        return d
      })
      //   陣列排序
      .sort((a, b) => {
        // a-b是正序排，由近到遠
        return a.distance - b.distance
      })
      // .slice(開始位置,結束位置)，(0,5) => 取五個資料
      .slice(0, 5)
      // 變成訊息模板的型態----------------------------
      .map((d) => {
        // 註：template在../templates/taiwangods.js裡是函式
        const t = template() // 訊息模板
        // 地址名稱
        t.body.contents[0].text = d.LL_Title
        t.body.contents[1].text = d.LL_Highlights
        t.body.contents[2].contents[0].contents[1].text =
          d.LL_Country + d.LL_Area + d.LL_Address
        t.body.contents[2].contents[1].contents[1].text = d.LL_OpeningData
        t.body.contents[2].contents[2].contents[1].text = d.LL_OpeningTime
        // 地圖網址（d.L_MapY、d.L_MapX為經緯度）
        t.footer.contents[0].action.uri = `https://www.google.com/maps/search/?api=1&query=${d.L_MapY},${d.L_MapX}`
        t.footer.contents[1].action.uri = `https://taiwangods.moi.gov.tw/html/landscape/1_0011.aspx?i=${d.L_ID}`
        return t
      })
    // 機器人要傳送的訊息------------------------------
    const result = await event.reply({
      // 要用模板一定要設定type: 'flex'
      type: 'flex',
      // 替代文字，LINE沒有進入聊天室會看到的訊息
      altText: '宗教文化查詢結果',
      // 多張卡片的寫法
      contents: {
        type: 'carousel', // 單張卡片的話寫bubble
        contents: replies
      }
    })
    if (process.env.DEBUG === 'true') {
      console.log(result)
      // 這邊用於debug----------------------------
      // result有message欄位時，表示訊息模板出現問題
      if (result.message) {
        // .writeFileSync(寫入的檔案, 要寫入的內容)把內容寫在指定的檔案裡面
        // .stringify()將 JavaScript 對象或值轉換為 JSON 字符串的方法。(內容,把裡面的東西做取代,幾個縮排)，用於排版
        fs.writeFileSync('./dump/twgod.json', JSON.stringify(replies, null, 2))
        // 這樣當有問題時，訊息的JSON就會寫到dump資料夾，再將檔案裡的內容貼到LINE訊息模板製作的網站，就會告訴你是那裡有問題
      }
    }
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤')
  }
}
