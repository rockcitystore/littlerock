import Taro from '@tarojs/taro'

const db = Taro.cloud.database({
  throwOnNotFound: false
})
const _ = db.command
const itemDetailDb = db.collection('item-detail')
const $ = _.aggregate
const RegExp = db.RegExp
export default {
  itemDetailDb,
  serverDate: db.serverDate,
  _,
  $,
  RegExp
}
