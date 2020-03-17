import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'
// pages/components/itmeLine.js
import item from '../../../utils/item.js'



@withWeapp({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object
    },
    idx: {
      type: Number
    },
    color: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},
  lifetimes: {
    attached: function () {
      this.addLineUpAnimation(130)
    },
    detached: function () {
      console.log('detached')
    },
    moved: function () {
      console.log('moved')
    }
  },
  pageLifetimes: {
    show: function () {
      this.addLineUpAnimation(100)
    },
    hide: function () {
      this.setData({
        // lineUpStyle: `background-color:${this.data.color};`
      })
    },
    resize: function (size) {
      console.log('resize')
    }
  },
  ready: function () {
    console.log(this.data.color)
    //todo  add animation style
  },
  /**
   * 组件的方法列表
   */
  methods: {
    addLineUpAnimation: function (speed) {
      if (this.data.idx < 30) {
        this.setData({
          // lineUpStyle: `animation: line-up ${(this.data.idx + 1) * speed}ms;animation-fill - mode: forwards; background-color:${this.data.color};`
          lineUpStyle: `animation: line-up ${(this.data.idx + 1) *
            speed}ms;animation-fill - mode: forwards;`
        })
      }
    },
    focusChange: function () {
      this.setData({
        focusClass: 'item-num-focus'
      })
    },
    goToItemDetail: function () {
      Taro.showToast({
        icon: 'loading'
      })
      Taro.navigateTo({
        url: `../itemDetail/itemDetail?state=edit&_id=${this.data.itemData._id}`
      })
    },
    onNumChange(itemId, event) {
      console.log('onNumChange', itemId, event);

      const { currentTarget } = event

      this.setData({
        focusClass: ''
      })
      console.log(
        itemId,
        '前值:',
        this.data.itemData.stock,
        '后值:',
        currentTarget.value
      )

      if (this.data.itemData.stock != currentTarget.value) {
        item.update(
          { _id: this.data.itemData._id, stock: currentTarget.value },
          () => {
            Taro.showToast({
              title: `更新成功！`,
              icon: 'success'
            })
            this.setData({
              'itemData.stock': currentTarget.value
            })
          }
        )
      }
    }
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { idx, lineUpStyle, itemData = {}, focusClass } = this.data
    return (
      <View className={'item-line-warp item-' + idx} style={lineUpStyle}>
        <View className='item-desc' onClick={this.goToItemDetail}>
          <Text className='item-name'>{itemData.name || '名称'}</Text>
          {/* <Text className='item-uptime'>
            {itemData.updateTime && itemData.updateTime.toLocaleString('zh-CN', { hour12: false }) || itemData.createTime && itemData.createTime.toLocaleString('zh-CN', { hour12: false })}
          </Text> */}
        </View>
        <Input
          onBlur={this.onNumChange.bind(this, itemData._id)}
          className={'item-num ' + focusClass}
          type='digit'
          placeholder=''
          value={itemData.stock}
          onFocus={this.focusChange}
        ></Input>
      </View>
    )
  }
}

export default _C
