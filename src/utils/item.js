import Taro from '@tarojs/taro'
import db from './db.js'

const STATES = {
  DEL: -1,
  ADD: 0
}

const add = data => {
  Taro.showToast({
    icon: 'loading'
  })
  data.state = STATES.ADD
  data.createTime = db.serverDate()
  data.updateTime = data.createTime
  return new Promise(function(resolve, reject) {
    return db.itemDetailDb.add({
      // data 字段表示需新增的 JSON 数据
      data,
      //  data: {
      //    name: "一个东西",
      //    price: 398.00,
      //    stock: 0,
      //    desc: "这是一个很长的很长的很长的很长的很长的很长的很长的备注",
      //    state: 1,
      //    createTime: db.serverDate(),
      //    updateTime: db.serverDate()
      //  },
      success: res => {
        return resolve(res)
      }
    })
  })
}

const update = (where, callback) => {
  const { _id, _openid } = where
  if (_id) {
    delete where._id
    if (_openid) delete where._openid
    where.updateTime = db.serverDate()
    db.itemDetailDb
      .where({
        _id
      })
      .update({
        data: where,
        success: function(res) {
          callback && callback(res)
        },
        fail: function(err) {
          console.error('item.update', err)
        }
      })
  }
}

const del = (where, callback) => {
  if (where._id) {
    db.itemDetailDb.where(where).update({
      data: {
        state: STATES.DEL
      },
      success: function(res) {
        callback && callback(res)
      }
    })
  }
}

const search = (content, callback) => {
  if (content) {
    db.itemDetailDb
      .where(
        db._.and([
          db._.or([
            {
              name: db.RegExp({
                regexp: '.*' + content,
                options: 'i'
              })
            }
          ]),
          {
            state: db._.neq(STATES.DEL)
          }
        ])
      )
      .get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          callback && callback(res.data)
        }
      })
  } else {
    watch(callback)
  }
}

const getItemDetail = (where, callback) => {
  db.itemDetailDb.where(where).get({
    success: function(res) {
      // console.log(res.data, callback)
      callback && callback(res.data)
    }
  })
}

const watch = callback => {
  db.itemDetailDb
    .where({
      state: db._.neq(STATES.DEL)
    })
    .orderBy('updateTime', 'desc')
    // .orderBy('createTime', 'desc')
    .watch({
      onChange: function(res) {
        // console.log(res.docs)
        callback && callback(res.docs || [])
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })

  // .get({
  //   success: function(res) {
  //     callback && callback(res.data)
  //   }
  // })
}

export default  {
  watch,
  add,
  search,
  del,
  update,
  getItemDetail
}
