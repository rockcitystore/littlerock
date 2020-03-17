/* eslint-disable no-shadow */
import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './app.scss'

@withWeapp({
  onLaunch: function() {
    Taro.cloud.init()

    Taro.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result)
        this.globalData.openId = res.result.openid
      }
    })

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    Taro.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('wx.login', res)

        // 获取用户信息
        Taro.getSetting({
          success: res => {
            console.log('getSetting', res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              Taro.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  console.log('getUserInfo', res)
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    openId: null
  }
})
class App extends Taro.Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/itemDetail/itemDetail',
      'pages/home/home'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '石城商场',
      navigationBarTextStyle: 'black'
    },
    sitemapLocation: 'sitemap.json',
    usingComponents: {
    },
    plugins: {
      chatbot: {
        version: '1.1.13',
        provider: 'wx8c631f7e9f2465e1'
      },
      WechatSI: {
        version: '0.3.3',
        provider: 'wx069ba97219f66d99'
      }
    },
    requiredBackgroundModes: ['audio']
  }

  render() {
    return null
  }
}
//app.js

export default App
Taro.render(<App />, document.getElementById('app'))
