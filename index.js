// 1. 引入套件
import 'dotenv/config' // 用於讀取環境設定檔(.env)，將.env裡的變數放入process.env裡面
import linebot from 'linebot' // 引用機器人套件
// 5.引入commands裡設定的指令
import commandFE from './commands/fe.js'
import commandTWGod from './commands/twgod.js'
import commandUsd from './commands/usd.js'
// 引入套件
import { scheduleJob } from 'node-schedule' // 用於排程

import * as usdtwd from './data/usdtwd.js'

// https://crontab.guru/#0_5_*_*_*
// 設定排程，每天早上五點就會執行這個function來更新匯率，可以節省找資料的時間
scheduleJob('0 5 * * *', () => {
  usdtwd.update()
})
// 使啟動機器人的時候也會進行這個function
usdtwd.update()

// 2. 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 4. 當機器人收到訊息(message)時要執行的程式碼-----------------------------------------------------------------------------
// event => 表示該訊息事件的資訊， 包含了訊息的類型、文字等
bot.on('message', (event) => {
  // .env的變數都被解析成文字，因此process.env.DEBUG的true為文字，要用''框起來
  // DEBUG用於判斷本機開發還是雲端伺服器，上傳雲端的時候可以將.env裡的DEBUG設定為false，這樣就不會執行下面程式碼
  // 本機開發才執行console.log(event)
  if (process.env.DEBUG === 'true') {
    console.log(event)
  }
  if (event.message.type === 'text') {
    // event.message.text為使用者傳送的文字
    if (event.message.text === '前端') {
      commandFE(event)
    } else if (event.message.text === 'usd') {
      commandUsd(event)
      // quick reply-------------------------------------
    } else if (event.message.text === 'qr') {
      // event.reply 為機器人回覆的訊息
      event.reply({
        type: 'text',
        text: '123',
        quickReply: {
          // items表示quick replies有哪些按鈕
          items: [
            {
              type: 'action',
              action: {
                type: 'message', // 表示按下去後使用者會傳送訊息
                text: 'ubike:taipei', // 表示按下去後使用者會傳送的訊息內容
                label: 'taipei' // 按鈕的文字
              }
            },
            {
              type: 'action',
              action: {
                type: 'uri', // 按下去後使用者會打開網頁
                uri: 'https://wdaweb.github.io',
                label: '職訓'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback', // 按下去後使用者傳送的訊息不會出現在聊天室，需另外寫bot.on('postback', .....)
                uri: 'https://wdaweb.github.io',
                label: '職訓',
                data: 'aaa' // 使用者要傳送到伺服器的東西
              }
            }
          ]
        }
      })
    }
  } else if (event.message.type === 'location') {
    // commandTWGod待確認
    commandTWGod(event)
  }
})

bot.on('postback', (event) => {
  console.log(event)
  event.reply('aaa')
})

// 3. 設定機器人的網頁伺服器，去監聽指定的port跟指定的路徑的請求
// process.env.PORT || 3000 表示：若環境變數裡有PORT就用它，沒有就用3000
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
