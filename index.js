// 引入套件
import 'dotenv/config'
import linebot from 'linebot'
// 引入commands裡的檔案，
import commandFE from './commands/fe.js'
import commandTWGod from './commands/twgod.js'
import commandUsd from './commands/usd.js'
import { scheduleJob } from 'node-schedule'
import * as usdtwd from './data/usdtwd.js'

// https://crontab.guru/#0_5_*_*_*
// 設定排程，每天早上五點就會執行這個function來更新匯率，可以節省找資料的時間
scheduleJob('0 5 * * *', () => {
  usdtwd.update()
})
// 使啟動機器人的時候也會進行這個function
usdtwd.update()
// 設定機器人
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 當機器人收到訊息時，執行{}內的程式碼
// event 包含了訊息的類型、文字等（待編輯）
bot.on('message', event => {
// process.env.DEBUG的true為文字，要用''框起來
  if (process.env.DEBUG === 'true') {
    console.log(event)
  }
  if (event.message.type === 'text') {
    // event.message.text為使用者傳送的文字
    if (event.message.text === '前端') {
      // commandFE()待確認
      commandFE(event)
    } else if (event.message.text === 'usd') {
      // 執行command>usd.js裡的函數
      commandUsd(event)
    } else if (event.message.text === 'qr') {
      // 這裡是quick reply
      // event.reply 為機器人回覆的訊息
      event.reply({
        type: 'text',
        text: '123',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'message',
                // 按下去使用者會傳送出的文字
                text: 'ubike:taipei',
                // 按鈕文字
                label: 'taipei'
              }
            },
            {
              type: 'action',
              action: {
                type: 'uri',
                uri: 'https://wdaweb.github.io',
                label: '職訓'
              }
            },
            {
              type: 'action',
              action: {
                // 使使用者傳送的訊息不會出現在聊天室
                type: 'postback',
                uri: 'https://wdaweb.github.io',
                label: '職訓',
                data: 'aaa'
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

bot.on('postback', event => {
  console.log(event)
  event.reply('aaa')
})
// 設定機器人監聽 port
bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
