import { exrate } from '../data/usdtwd.js'

export default async (event) => {
  try {
    // LINE要文字格式而不是數字，所以要用.toString()轉成文字
    const result = await event.reply(exrate.toString())
    if (process.env.DEBUG === 'true') {
      console.log(result)
    }
  } catch (error) {
    console.log(error)
  }
}
