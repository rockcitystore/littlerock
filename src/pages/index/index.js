import { Block, View, Input, Icon } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import ItemList from '../components/item-list'
import './index.scss'
//index.js
//获取应用实例
import item from '../../utils/item.js'

const app = Taro.getApp()



//数据看板
//已删除列表
//效期提醒
//周期购

@withWeapp({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: Taro.canIUse('button.open-type.getUserInfo'),
    itemListDataLength: 0,
    itemListData: [],
    itemRecord: '',
    blackClass: 'hide',
    searchActiveClass:'',
    serchItemClass:'',
    chaBarFocus:false,
    searchBtnClass:'',
    addItemBtnClass:'',
    notFoundClass:'',
    chaPlaceHolder:''
  },
  goToChat: function() {
    Taro.navigateTo({
      url: '../home/home'
    })
  },
  blackHide: function() {
    this.setData({
      blackClass: 'hide',
      serchItemClass: '',
      searchActiveClass: '',
      chaBarFocus: false,
      chaBarVal: '',
      notFoundClass: ''
    })
  },
  goToItemDetail: function() {
    //点击效果
    this.setData(
      {
        addItemBtnClass: 'btn-active'
      },
      () => {
        setTimeout(() => {
          this.setData({
            addItemBtnClass: ''
          })
        }, 100)
        Taro.navigateTo({
          url: '../itemDetail/itemDetail?state=add'
        })
      }
    )
  },
  recordChaBarVal: function(e) {
    const { detail } = e
    this.setData({
      recordChaBarVal: detail.value
    })
  },
  searchItem: function(e) {
    this.setData(
      {
        searchActiveClass: 'search-item-bar-tool-active',
        chaPlaceHolder:"",
        chaBarFocus: false,
      },
      () => {
        setTimeout(() => {
          this.setData({
            searchActiveClass: 'search-item-bar'
          })
        },400)
      }
    )
    const { detail, currentTarget } = e
    let searchContent = detail.value
    if (currentTarget.dataset.type === 'cha') {
      searchContent = this.data.recordChaBarVal
    } else {
      this.setData({
        recordChaBarVal: detail.value
      })
    }
    // console.log(searchContent)
    item.search(searchContent, itemListData => {
      // console.log(itemListData)
      this.setData(
        {
          itemListData,
          itemListDataLength: itemListData.length,
          itemRecord: itemListData.length ? `${itemListData.length}条记录` : ''
        },
        () => {
          if (this.data.itemListDataLength) {
            this.blackHide()
          } else {
            this.setData({
              notFoundClass: 'show-not-found'
            })
          }
        }
      )
    })
  },
  showSearchItemBar: function() {
    //显示搜索框
    if (this.data.serchItemClass === 'search-item-bar-open') {
      this.setData({
        blackClass: 'hide',
        serchItemClass: '',
        chaBarFocus: false,
        chaPlaceHolder:""
      })
    } else {
      this.setData(
        {
          blackClass: 'show',
          serchItemClass: 'search-item-bar-open',
          
        },
        () => {
          setTimeout(() => {
            this.setData({
              chaBarFocus: true,
              chaPlaceHolder:"全部"
            })
          }, 300)
        }
      )
    }
  },
  watchItem: function() {
    item.watch(itemListData => {
      // console.log(itemListData)
      this.setData({
        itemListData,
        itemListDataLength: itemListData.length,
        itemRecord: itemListData.length ? `${itemListData.length}条记录` : ''
      })
      this.blackHide()
    })
  },
  onReady: function() {
    Taro.showToast({
      icon: 'loading'
    })
    // this.goToItemDetail()
    this.watchItem()
  },
  onLoad: function() {
    console.log('index onLoad')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      Taro.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log('getUserInfo', e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
class _C extends Taro.Component {
  config = {}

  render() {
    const {
      itemRecord,
      searchActiveClass,
      serchItemClass,
      chaBarFocus,
      chaBarVal,
      searchBtnClass,
      addItemBtnClass,
      notFoundClass,
      itemListData,
      blackClass,
      chaPlaceHolder
    } = this.data
    return (
      <Block>
        <View className='container'>
          <View className='header'>
            <View className='item-record'>{itemRecord}</View>
            <View className='header-right'>
              <View
                className={'search-item-bar-tool ' + searchActiveClass}
              ></View>
              <View className={'search-item-bar ' + serchItemClass}>
                <Input
                  focus={chaBarFocus}
                  confirmType='search'
                  className='weui-input cha-bar'
                  confirmHold='true'
                  onConfirm={this.searchItem}
                  onInput={this.recordChaBarVal}
                  value={chaBarVal}
                  placeholder={chaPlaceHolder}
                ></Input>
                <View
                  className='cha-btn'
                  onClick={this.searchItem}
                  data-type='cha'
                >
                  <Icon type='search' color='#FFE900'></Icon>
                </View>
              </View>
              <View
                onClick={this.showSearchItemBar}
                className={'item-btn search-item-btn ' + searchBtnClass}
              >
                <Icon type='search' color='#FFE900'></Icon>
              </View>
              <View
                onClick={this.goToItemDetail}
                className={'item-btn add-item-btn ' + addItemBtnClass}
              >
                增
              </View>
              <View
                onClick={this.goToChat}
                className={'item-btn add-item-btn ' + addItemBtnClass}
              >
                石
              </View>
            </View>
          </View>
          <View className={'not-found ' + notFoundClass}>
            哦豁，什么都没有找到~
          </View>
          <ItemList itemListData={itemListData}></ItemList>
          <View className='index-footer'>开始一条新的记录吧~</View>
        </View>
        <View onClick={this.blackHide} className={'black ' + blackClass}></View>
      </Block>
    )
  }
}

export default _C
