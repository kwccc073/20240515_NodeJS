import axios from 'axios'
import { distance } from '../utils/distance.js'
import template from '../templates/taiwangods.js'
import fs from 'node:fs'
// node: 表示node js內建的套件
// fs表示檔案處理，可以讀也可以寫

export default async event => {
  try {
    const { data } = await axios.post('https://taiwangods.moi.gov.tw/Control/SearchDataViewer.ashx?t=landscape', new URLSearchParams({
      lang: 1,
      area: '',
      rtype: '',
      festival: '',
      keyWord: '',
      festival_s: '',
      festival_e: ''
    }))
    const replies = data
      .map(d => {
        // 對陣列每個東西裡面加上distance欄位，distance為一個陣列，內容如括弧
        d.distance = distance(d.L_MapY, d.L_MapX, event.message.latitude, event.message.longitude, 'K')
        return d
      })
    //   陣列排序
      .sort((a, b) => {
        return a.distance - b.distance
      })
    //   .slice(開始位置,結束位置)，(0,5)即取五個
      .slice(0, 5)
      .map(d => {
        const t = template()
        // 地址名稱
        t.body.contents[0].text = d.LL_Title
        t.body.contents[1].text = d.LL_Highlights
        t.body.contents[2].contents[0].contents[1].text = d.LL_Country + d.LL_Area + d.LL_Address
        t.body.contents[2].contents[1].contents[1].text = ''
        t.body.contents[2].contents[2].contents[1].text = d.LL_OpeningTime
        // 地圖網址（d.L_MapY、d.L_MapX為經緯度）
        t.footer.contents[0].action.uri = `https://www.google.com/maps/search/?api=1&query=${d.L_MapY},${d.L_MapX}`
        t.footer.contents[1].action.uri = `https://taiwangods.moi.gov.tw/html/landscape/1_0011.aspx?i=${d.L_ID}`
        return t
      })
    const result = await event.reply({
      type: 'flex',
      altText: '宗教文化查詢結果',
      contents: {
        type: 'carousel',
        contents: replies
      }
    })
    if (process.env.DEBUG === 'true') {
      console.log(result)
      // 這邊用於debug
      if (result.message) {
        /* 寫入的檔案,內容,取代的功能,幾個縮排 */
        fs.writeFileSync('./dump/twgod.json', JSON.stringify(replies, null, 2))
      }
    }
  } catch (error) {
    console.log(error)
    event.reply('發生錯誤')
  }
}
