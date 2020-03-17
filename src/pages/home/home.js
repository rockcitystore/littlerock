import { Block, View, Textarea, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './home.scss'
// pages/home/home.js
var plugin = Taro.requirePlugin('chatbot')

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    plugin.init({
      appid: 'AEQm8Wrn3YeUHGbD9cfZ6PlpiwnXni', //小程序示例账户，仅供学习和参考
      openid: '', //用户的openid，非必填，建议传递该参数
      success: () => {
        console.info('chatbot init susccess')
      }, //非必填
      fail: error => {
        console.error('chatbot init fail', error)
      } //非必填
      // , guideList: ["您好"],
      // // textToSpeech: true, //默认为ture打开状态
      // welcome: "请问有什么需要帮助？",
      // welcomeImage: 'http://inews.gtimg.com/newsapp_bt/0/10701537095/1000',
      // background: "rgba(247,251,252,1)",
      // guideCardHeight: 40,
      // operateCardHeight: 145,
      // history: true,
      // historySize: 60,
      // navHeight: 0,
      // robotHeader: 'https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/leftHeader.png',
      // userHeader: 'https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/rightHeader.png',
      // userName: '',
      // defaultWheel: ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  bindconfirm: function(e) {
    let _this = this
    if (_this.data.value === '') {
      return false
    }
    _this.getData(e.detail.value)
  },
  bindinput: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  // goBackHome回调 返回上一级页面
  goBackHome: function() {
    Taro.navigateBack({
      delta: 1
    })
  },
  // getQueryCallback回调, 返回数据
  getQueryCallback: function(e) {},
  // 点击机器人回答里的链接跳转webview,需要开发者自己配置一个承载webview的页面,url字段对应的小程序页面需要开发者自己创建
  // 开发者需要在小程序后台配置相应的域名
  // 1.1.7版本开始支持
  openWebview: function(e) {
    let url = e.detail.weburl
    Taro.navigateTo({
      url: `/pages/webviewPage/webviewPage?url=${url}`
    })
  },
  // 点击机器人回答中的小程序，需要在开发者自己的小程序内做跳转
  // 开发者需要在小程序配置中指定跳转小程序的appId
  // 1.1.7版本开始支持
  openMiniProgram(e) {
    let { appid, pagepath } = e.detail
    Taro.navigateToMiniProgram({
      appId: appid,
      path: pagepath,
      extraData: {},
      envVersion: '',
      success(res) {
        // 打开成功
      }
    })
  },
  btn: function() {
    let _this = this
    if (_this.data.value === '') {
      return false
    }
    _this.getData(_this.data.value)
  },
  getData: function(val) {
    let _this = this

    plugin.api.nlp('tokenize', { q: val }).then(res => {
      console.log('tokenize result : ', res)
    })
    // plugin.api.tokenize(val).then(e => {
    //   console.log(e)
    //   if(e.success){
    //     let entitiesBoolean = false
    //     if (e.entities.length !== 0) {
    //       entitiesBoolean = true
    //     }
    //     let words = []
    //     e.words.forEach((item, index) => {
    //       if (item === ' ') {
    //         item = '空格'
    //       }
    //       words.push({ date: e.POSs[index], data: item })
    //     })

    //     let words_mix = []
    //     e.words_mix.forEach((item, index) => {
    //       if (item === ' ') {
    //         item = '空格'
    //       }
    //       words_mix.push({ date: e.POSs_mix[index], data: item })
    //     })

    //     let obj = { entities: e.entities, entity_types: e.entity_types }

    //     let typeArr = [...obj.entity_types]
    //     let entArr = [...obj.entities]
    //     let objs = {}
    //     typeArr.forEach((item, index) => {
    //       if (!objs[item]) {
    //         objs[item] = new Array()
    //         objs[item].push(entArr[index])
    //       } else {
    //         objs[item].push(entArr[index])
    //       }
    //     })
    //     let properNoun = []
    //     for (var i in objs) {
    //       properNoun.push({ date: i, data: objs[i] })
    //     }
    //     let POSs = [...new Set(e.POSs)]
    //     let POSs_mix = [...new Set(e.POSs_mix)]
    //     _this.setData({
    //       choosePOSs: _this.data.checked ? e.POSs_mix[0] : e.POSs[0],
    //       terms_top_border: true,
    //       value: val,
    //       words: words,
    //       words_mix: words_mix,
    //       POSs: POSs,
    //       POSs_mix: POSs_mix,
    //       entities: e.entities,
    //       entity_type: e.entity_types,
    //       properNoun: properNoun,
    //       entitiesBoolean: entitiesBoolean
    //     })
    //   }

    // })
  }
})
class _C extends Taro.Component {
  config = {
    chatbot: 'plugin://chatbot/chat',
    disableScroll: true
  }

  render() {
    const { value } = this.data
    return (
      <View style="height: 100vh;width:100vw;">
        <Textarea
          maxlength={-1}
          onInput={this.bindinput}
          onConfirm={this.bindconfirm}
          value={value}
          className="textarea"
          placeholder="请输入"
        ></Textarea>
        <Button onClick={this.btn}>查询</Button>
        <Chat
          onBackHome={this.goBackHome}
          onQueryCallback={this.getQueryCallback}
          onOpenWebview={this.openWebview}
          onOpenMiniProgram={this.openMiniProgram}
        ></Chat>
      </View>
    )
  }
}

export default _C
