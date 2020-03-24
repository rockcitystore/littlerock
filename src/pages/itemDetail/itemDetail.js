import {
  Picker,
  View,
  Label,
  Input,
  Textarea
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import { AtForm, AtModal, AtButton } from 'taro-ui'

import './itemDetail.scss'
import item from '../../utils/item.js'

const app = Taro.getApp()

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    dialogShow: false,
    descLength: 0,
    commentLength: 0,
    showRequired: {},
    isLoading:false,
    rules: [
      {
        name: 'name',
        rules: {
          required: true,
          message: 'name必填'
        }
      },
      {
        name: 'price',
        rules: {
          required: true,
          message: 'price必填'
        }
      },
      {
        name: 'stock',
        rules: {
          required: true,
          message: 'stock必填'
        }
      },
      {
        name: 'totalPrice',
        rules: {
          required: true,
          message: 'totalPrice必填'
        }
      },
    ]
  },
  onLoad: function () {
    console.log('onLoad')
    this.onReset()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    console.log('onShow')

    const { state, _id } = options
    this.setData({
      _id,
      pageState:state,
    })
    console.log('itemDetial', state, _id, app.globalData.openId)
    switch (state) {
      case 'add':
        this.setData({
          _id: null,
        })
        return
      case 'edit':
        item.getItemDetail(
          {
            _id,
            _openid: app.globalData.openId
          },
          (res = []) => {
            console.log(
              'getItemDetail',
              res[0],
              res[0].updateTime,
              typeof res[0].updateTime
            )

            res[0].updateTime =
              res[0].updateTime &&
              res[0].updateTime.toLocaleString('zh-CN', { hour12: false })
            res[0].createTime =
              res[0].createTime &&
              res[0].createTime.toLocaleString('zh-CN', { hour12: false })
            return this.setData({
              formData: res[0] || {},
              descLength:res[0].desc&&res[0].desc.length,
              commentLength:res[0].comment&&res[0].comment.length,
            })
          }
        )
    }
  },
  onHide: function () {
    console.log('onHide')
  },
  onUnload: function () {
    console.log('onUnload')
  },
  openConfirm: function () {
    this.setData({
      dialogShow: true
    })
  },

  handleConfirm: function () {
    this.delItem()
  },
  handleCancel: function () {
    this.setData({
      dialogShow: false
    })
  },

  addItem: function () {
    console.log(this.data.pageState)
    this.setData({isLoading:true})
    switch (this.data.pageState) {
      case 'add':
        return item.add(this.data.formData).then(res => {
          Taro.showToast({
            title: `${res._id}新增成功！`,
            icon: 'success',
            duration: 5000,
            complete: Taro.navigateBack()
          })
        })
      case 'edit':
        return item.update(this.data.formData, () => {
          Taro.showToast({
            title: `更新成功！`,
            icon: 'success',
            duration: 5000,
            complete: Taro.navigateBack()
          })
        })
    }
  },

  bindDateChange: function (e) {
    console.log('bindDateChange', e)
    this.setData({
      date: e.detail.value,
      [`formData.${e.target.dataset.field}`]: e.detail.value
    })
  },
  formInputChange(field, e) {
    console.log(field, e)
    // console.log(field, e.detail.value, this.data.formData.price, this.data.formData.stock)
    if (field === 'price') {
      if (this.data.formData.stock) {
        return this.setData({
          [`formData.${field}`]: e.detail.value,
          ['formData.totalPrice']: e.detail.value * this.data.formData.stock
        })
      } else {
        return this.setData({
          [`formData.${field}`]: e.detail.value
        })
      }
    } else if (field === 'stock') {
      if (this.data.formData.price) {
        // console.log(1, e.detail.value * this.data.formData.price)
        return this.setData({
          [`formData.${field}`]: e.detail.value,
          [`formData.totalPrice`]: e.detail.value * this.data.formData.price
        })
      } else {
        return this.setData({
          [`formData.${field}`]: e.detail.value
        })
      }
    } else if (field === 'desc') {
      this.setData({
        'descLength': e.detail.value.length,
        [`formData.${field}`]: e.detail.value
      })
    } else if (field === 'comment') {
      this.setData({
        'commentLength': e.detail.value.length,
        [`formData.${field}`]: e.detail.value
      })
    } else {
      return this.setData({
        [`formData.${field}`]: e.detail.value
      })
    }
  },

  validate(data) {
    console.log('validate', data)
    return new Promise((resolve) => {
      this.setData({
        showRequired:{}
      })
      let errorObj = {}
      //validate form data
      for (let i = 0, il = this.data.rules.length; i < il; i++) {
        let rule = this.data.rules[i];
        // console.log('rule', rule)
        if (rule.rules.required) {
          let key = rule.name
          let value = data[key]
          console.log(key, value,typeof value,value === 0 ,value !== undefined,value !== '' , value !== null)
          if(Number(value)===0){
            // console.log('ok')
          }else if (value !== undefined && value !== '' && value !== null) {
            // console.log('ok')
          } else {
            // console.log(rule.rules.message)
            errorObj[key] = rule.rules.message
          }
        } else {
              //fei bi tian jiao yan
        }

      }

      console.log(errorObj)
      for (let key in errorObj) {
        if (key) { 
          this.setData({
            [`showRequired.${key}`]: errorObj[key] 
          })
      }
      }
      return resolve(Object.keys(errorObj).length) 
    })
  },
  submitForm() {
    console.log(('submitForm', this.data.formData))

    this.validate(this.data.formData).then((error) => {
      if (error) {
        Taro.showToast({
          title: `内容不正确`,
          icon: 'fail',
          duration: 5000
        })
      } else {
        console.log('addItem')
        this.addItem() 
      }
    })
  },
  delItem() {
    item.del(
      {
        _id: this.data.formData._id
      },
      () => {
        Taro.showToast({
          title: `删除成功！`,
          icon: 'success',
          duration: 5000,
          complete: Taro.navigateBack()
        })
      }
    )
  },
  onReset() {
    return this.setData({ formData: {} })
  }

})
class _C extends Taro.Component {
  config = {}

  render() {
    const {
      formData,
      dialogShow,
      descLength,
      commentLength,
      showRequired,
      isLoading,
      pageState
    } = this.data
    return (
      <AtForm
        onSubmit={this.submitForm.bind(this)}
        onReset={this.onReset.bind(this)}
      >
        <AtForm className='item-detail-form'>
          <View className='item-form-desc'>点滴记录，汇聚成河。</View>

          <View className='item-detail-class'>
            <View className='item-form-subtitle'>必填<Label>*</Label></View>
            <View className='at-input weui-input'>
              <View showError prop='name' title='name' className='at-input__container'>
                <Label className='at-input__title'>name</Label>
                <Input
                  title='name'
                  placeholderStyle='color:rgba(59, 120, 231, 0.68);'
                  onInput={this.formInputChange.bind(this, 'name')}
                  className='at-input__input'
                  value={formData.name}
                  placeholder='请输入名称'
                ></Input>
                {showRequired.name ? <View className='at-icon at-icon-close-circle check-icon'></View> : <View></View>}
              </View>
            </View>

            <View className='at-input weui-input'>
              <View showError prop='price' title='price(￥)' className='at-input__container'>
                <Label className='at-input__title'>price(￥)</Label>
                <Input
                  title='price(￥)'
                  placeholderStyle='color:rgba(59, 120, 231, 0.68);'
                  onInput={this.formInputChange.bind(this, 'price')}
                  type='digit'
                  className='at-input__input'
                  value={formData.price}
                  placeholder='请输入单价'
                ></Input>
                {showRequired.price ? <View className='at-icon at-icon-close-circle check-icon'></View> : <View></View>}
              </View>
            </View>

            <View className='at-input weui-input'>
              <View showError prop='stock' title='stock' className='at-input__container'>
                <Label className='at-input__title'>stock</Label>
                <Input
                  title='stock'
                  placeholderStyle='color:rgba(59, 120, 231, 0.68);'
                  onInput={this.formInputChange.bind(this, 'stock')}
                  type='digit'
                  className='at-input__input'
                  value={formData.stock}
                  placeholder='请输入采购量'
                ></Input>
                {showRequired.stock ? <View className='at-icon at-icon-close-circle check-icon'></View> : <View></View>}
              </View>
            </View>

            <View className='at-input weui-input'>
              <View prop='totalPrice' title='totalPrice(￥)' className='at-input__container'>
                <Label className='at-input__title'>totalPrice(￥)</Label>
                <Input
                  title='totalPrice(￥)'
                  placeholderStyle='color:rgba(59, 120, 231, 0.68);'
                  onChange={this.formInputChange.bind(this, 'totalPrice')}
                  data-field='totalPrice'
                  value={formData.totalPrice}
                  type='digit'
                  className='at-input__input'
                ></Input>
                {showRequired.totalPrice ? <View className='at-icon at-icon-close-circle check-icon'></View> : <View></View>}
              </View>
            </View>
          
          </View>

            <View className='item-detail-class'>
              <View className='item-form-subtitle'>非必填</View>
              <View className='at-input weui-input'>
                <View prop='brand' title='brand' className='at-input__container'>
                  <Label className='at-input__title'>brand</Label>
                  <Input
                    title='brand'
                    placeholderStyle='color:rgba(59, 120, 231, 0.68);'
                    onInput={this.formInputChange.bind(this, 'brand')}
                    className='at-input__input'
                    value={formData.brand}
                    placeholder='请输入品牌'
                  ></Input>
                </View>
              </View>

              <View className='at-input weui-input'>
                <View prop='specification' title='specification' className='at-input__container'>
                  <Label className='at-input__title'>specification</Label>
                  <Input
                    title='specification'
                    placeholderStyle='color:rgba(59, 120, 231, 0.68);'
                    onInput={this.formInputChange.bind(this, 'specification')}
                    data-field='specification'
                    className='at-input__input'
                    value={formData.specification}
                    placeholder='请输入规格'
                  ></Input>
                </View>
              </View>

              <View prop='desc' title='desc' className='form-line'>
                <Label className='at-input__title text-area-title'>desc</Label>
                <View className='at-textarea at-textarea--WEAPP'>
                  <Textarea
                    onInput={this.formInputChange.bind(this, 'desc')}
                    value={formData.desc}
                    placeholder='...'
                    className='item-comment at-textarea__textarea'
                  ></Textarea>
                  <View className='at-textarea__counter'>{descLength}</View>
                </View>
              </View>
              <View prop='buyTime' title='buyTime' className='form-line'>
                <Label className='at-input__title text-area-title'>buyTime</Label>
                <Picker
                  data-field='buyTime'
                  mode='date'
                  value={formData.buyTime}
                  onChange={this.bindDateChange}
                  className='form-picker'
                >
                  <View className='weui-input'>{formData.buyTime}</View>
                </Picker>
              </View>
              <View prop='expirationTime' title='expirationTime' className='form-line'>
                <Label className='at-input__title text-area-title'>expirationTime</Label>
                <Picker
                  data-field='expirationTime'
                  mode='date'
                  value={formData.expirationTime}
                  onChange={this.bindDateChange}
                  className='form-picker'
                >
                  <View className='weui-input'>{formData.expirationTime}</View>
                </Picker>
              </View>
              <View prop='comment' title='comment' className='form-line-last'>
                <Label className='at-input__title text-area-title'>comment</Label>
                <View className='at-textarea at-textarea--WEAPP'>
                  <Textarea
                    placeholderStyle='color:rgba(59, 120, 231, 0.68);'
                    onInput={this.formInputChange.bind(this, 'comment')}
                    value={formData.comment}
                    placeholder='...'
                    className='item-comment at-textarea__textarea'
                  ></Textarea>
                  <View className='at-textarea__counter'>{commentLength}</View>
                </View>
              </View>
            </View>
            <View className='times'>
          {formData.createTime && (
            <View>{'创建于:' + formData.createTime}</View>
          )}
          
          {formData.updateTime && (
            <View>{',更新于:' + formData.updateTime}</View>
          )}
        </View>
            <View className='form-btns'>
            <AtButton formType='submit' type='primary' size='normal' loading={isLoading} className='form-btn'>提交</AtButton>
            {pageState==='add' ? <AtButton formType='reset' type='secondary' size='normal' className='form-btn'>重置</AtButton> : <AtButton onClick={this.openConfirm.bind(this)} type='secondary' size='normal' className='form-btn'>删除</AtButton>}
          </View>
        </AtForm>
      
        <AtModal
          className='dialog-class'
          isOpened={dialogShow}
          cancelText='取消'
          confirmText='确定'
          onClose={this.handleCancel}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content={`确定删除${formData.name}吗？`}
        />

      </AtForm>
    )
  }
}

export default _C
