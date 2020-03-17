import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './dialog.scss'
module.exports = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {} // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }) // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ) // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true // Return the exports of the module
    /******/
    /******/ /******/ return module.exports
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      })
      /******/
    }
    /******/
  } // define __esModule on exports
  /******/
  /******/ /******/ __webpack_require__.r = function(exports) {
    /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: 'Module'
      })
      /******/
    }
    /******/ Object.defineProperty(exports, '__esModule', { value: true })
    /******/
  } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
  /******/
  /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
    value,
    mode
  ) {
    /******/ if (mode & 1) value = __webpack_require__(value)
    /******/ if (mode & 8) return value
    /******/ if (
      mode & 4 &&
      typeof value === 'object' &&
      value &&
      value.__esModule
    )
      return value
    /******/ var ns = Object.create(null)
    /******/ __webpack_require__.r(ns)
    /******/ Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    })
    /******/ if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key]
          }.bind(null, key)
        )
    /******/ return ns
    /******/
  } // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default']
          }
        : /******/ function getModuleExports() {
            return module
          }
    /******/ __webpack_require__.d(getter, 'a', getter)
    /******/ return getter
    /******/
  } // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  } // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
  /******/
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 20))
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ 20: /***/ function(module, exports, __webpack_require__) {
      'use strict'
    }

    /******/
  }
)

@withWeapp({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    extClass: {
      type: String,
      value: ''
    },
    maskClosable: {
      type: Boolean,
      value: true
    },
    mask: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: false,
      observer: '_showChange'
    },
    buttons: {
      type: Array,
      value: []
    }
  },
  data: {
    innerShow: false
  },
  ready: function ready() {
    var buttons = this.data.buttons
    var len = buttons.length
    buttons.forEach(function(btn, index) {
      if (len === 1) {
        btn.className = 'weui-dialog__btn_primary'
      } else if (index === 0) {
        btn.className = 'weui-dialog__btn_default'
      } else {
        btn.className = 'weui-dialog__btn_primary'
      }
    })
    this.setData({
      buttons: buttons
    })
  },

  methods: {
    buttonTap: function buttonTap(e) {
      var index = e.currentTarget.dataset.index

      this.triggerEvent(
        'buttontap',
        { index: index, item: this.data.buttons[index] },
        {}
      )
    },
    close: function close() {
      var data = this.data
      if (!data.maskClosable) return
      this.setData({
        show: false
      })
      this.triggerEvent('close', {}, {})
    },
    stopEvent: function stopEvent() {}
  }
})
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    const { show, mask, extClass, title, buttons } = this.data
    return (
      <Block>
        {mask && (
          <View
            onClick={this.close}
            className={'weui-mask ' + (!show ? 'weui-mask_hidden' : '')}
          ></View>
        )}
        {show && (
          <View onClick={this.close} className={'weui-dialog__wrp ' + extClass}>
            <View className="weui-dialog" onClick={this.stopEvent}>
              <View className="weui-dialog__hd">
                <View className="weui-dialog__title">
                  {title}
                  {this.props.renderTitle}
                </View>
              </View>
              <View className="weui-dialog__bd">{this.props.children}</View>
              <View className="weui-dialog__ft">
                {buttons && buttons.length ? (
                  <Block>
                    {buttons.map((item, index) => {
                      return (
                        <View
                          className={
                            'weui-dialog__btn ' +
                            item.className +
                            ' ' +
                            item.extClass
                          }
                          data-index={index}
                          onClick={this.buttonTap}
                        >
                          {item.text}
                        </View>
                      )
                    })}
                    {/*  <view class="weui-dialog__btn" bindtap="confirm">确认</view>  */}
                  </Block>
                ) : (
                  this.props.renderFooter
                )}
              </View>
            </View>
          </View>
        )}
      </Block>
    )
  }
}

export default _C
