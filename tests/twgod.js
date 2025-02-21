import axios from 'axios'

const main = async () => {
  try {
    // URLSearchParams()跟資料格式有關
    const { data } = await axios.post('https://taiwangods.moi.gov.tw/Control/SearchDataViewer.ashx?t=landscape', new URLSearchParams({
      lang: 1,
      area: '',
      rtype: '',
      festival: '',
      keyWord: '',
      festival_s: '',
      festival_e: ''
    }))
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

main()
