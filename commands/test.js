export default async (event) => {
  try {
    // LINE要文字而不是數字，所以要用.toString()
    const result = await event.reply('測試commandsTest')
    if (process.env.DEBUG === 'true') {
      console.log(result)
    }
  } catch (error) {
    console.log(error)
  }
}
