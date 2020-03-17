import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import ItemLine from '../item-line'
import './index.scss'
// pages/components/itemList/itemList.js
const color = require('../../../utils/color.js')

@withWeapp({
  /**
   * 组件的属性列表
   */
  properties: {
    itemListData: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},
  ready: function() {
    // console.log(this.data)
    console.log(color)
    this.setData({
      color
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {}
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { color, itemListData=[] } = this.data
    return itemListData.map((itemData, idx) => {
      return (
        <ItemLine
          className="item-line"
          key="idx"
          itemData={itemData}
          idx={idx}
          color={color[idx]}
        ></ItemLine>
      )
    })
  }
}

export default _C
