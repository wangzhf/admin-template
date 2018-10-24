
const provinceList = [{
  label: '北京',
  value: 1
}, {
  label: '上海',
  value: 2
}, {
  label: '广州',
  value: 3
}]

const cityList = [{
  label: '北京市',
  value: 5,
  provinceId: 1
}, {
  label: '上海市',
  value: 6,
  provinceId: 2
}, {
  label: '广州市',
  value: 7,
  provinceId: 3
}]

export default {
  getProvinceList: () => {
    return provinceList
  },
  getCityList: config => {
    console.log(config)
    const params = JSON.parse(config.body)
    if (params.pid) {
      const tmpList = cityList.filter(val => {
        if (val.provinceId === params.pid) {
          return true
        }
        return false
      })
      console.log('tpmList')
      console.log(tmpList)
      return tmpList
    } else {
      return cityList
    }
  }
}
