import axios from 'axios'

// 導出變數exrate(匯率)，並賦予初始值32
export let exrate = 32

export const update = async () => {
  try {
    // 更新匯率
    const { data } = await axios.get('https://tw.rter.info/capi.php')
    exrate = data.USDTWD.Exrate
  } catch (error) {
    console.log(error)
  }
}
