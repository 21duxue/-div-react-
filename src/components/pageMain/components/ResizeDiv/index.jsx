import React, { Component } from 'react'
import _ from 'underscore'
import styles from './index.css'

// 可调整宽高的Div
export default class ResizeDiv extends Component {
  
  state = {
    isHResize: false,
    isVResize: false,
    hNum: 300,
    vNum: 500,
    hNumLimit: 30,
    vNumLimit: 30
  }

  resizeOffsetInfo = {//初始化一些定位
    clientTop: 0,
    clientLeft: 0
  }

  leftHeight = 0

  containerWidth = 0

  componentDidMount() {
    this.initResizeInfo()
    const throttled = _.throttle(() => {
      this.initResizeInfo()
    }, 200)

    window.onresize = throttled
  }
  componentWillUnmount() {
    window.onresize = null
  }

  /**
   * 初始化resize信息
   */
  initResizeInfo = () => {
    const hEle = document.getElementById('h_resize_container')//左边盒子
    this.resizeOffsetInfo = this.getEleOffset(hEle)//拿到初始化左边盒子的高度，宽度，顶部、左边的距离
    this.leftHeight = hEle.offsetHeight//可见区域高度
    console.log(this.resizeOffsetInfo)
    console.log(this.leftHeight)
    this.containerWidth = document.getElementById('v_resize_container').offsetWidth//外围大盒子宽度

    // if (hEle.offsetHeight - this.state.hNum < this.state.hNumLimit) {
    //   this.setState({
    //     hNum: hEle.offsetHeight - this.state.hNumLimit//限制高度
    //   })
    // }
    if (this.containerWidth - this.state.vNum < this.state.vNumLimit) {
      this.setState({
        vNum: this.containerWidth - this.state.vNumLimit
      })
    }
  }

  /**
   * 获取元素的偏移信息
   */
  getEleOffset(ele) {
    
    //offsetLeft、offsetTop返回的值就是ele到offsetParent的距离，
    //这个offsetParent是什么元素要看ele的父元素有没有进行定位（relative、absolute）
    //ele到offsetParent的距离，
    var clientTop = ele.offsetTop
    var clientLeft = ele.offsetLeft

    //ele.offsetParent返回的是ele元素最近的并且是定位过(relative,absolute)的父元素
    //，如果没有父元素或者是父元素中没有一个是定位过的，返回值就是body元素

    let current = ele.offsetParent
    
    while (current !== null) {
      clientTop += current.offsetTop
      clientLeft += current.offsetLeft
      current = current.offsetParent
    }

    return {
      clientTop,//ele到offsetParent的顶部的距离，
      clientLeft,//ele到offsetParent的左边的距离，
      height: ele.offsetHeight,//表示元素在页面中所占用的总高度
      width: ele.offsetWidth,//表示元素在页面中所占用的总宽度
    }
  }

  /**
   * 开始拖动水平调整块
   */
  hResizeDown = () => {
    this.setState({
      isHResize: true
    })
  }

  /**
   * 拖动水平调整块
   */
  hResizeOver = (e) => {
    const { isHResize, hNum, hNumLimit } = this.state
    if (isHResize && hNum >= hNumLimit && (this.resizeOffsetInfo.height - hNum >= hNumLimit)) {
      let newValue = this.resizeOffsetInfo.clientTop + this.resizeOffsetInfo.height - e.clientY
      if (newValue < hNumLimit) {
        newValue = hNumLimit
      }
      if (newValue > this.resizeOffsetInfo.height - hNumLimit) {
        newValue = this.resizeOffsetInfo.height - hNumLimit
      }
      this.setState({
        hNum: newValue
      })
    }
  }

  /**
   * 开始拖动垂直调整块
   */
  vResizeDown = () => {
    this.setState({
      isVResize: true
    })
  }

  /**
   * 拖动垂直调整块
   */
  vResizeOver = (e) => {
    const { isVResize, vNum, vNumLimit } = this.state
    if (isVResize && vNum >= vNumLimit && (this.containerWidth - vNum >= vNumLimit)) {
      let newValue = e.clientX - this.resizeOffsetInfo.clientLeft
      console.log(e.clientX)
      if (newValue < vNumLimit) {
        newValue = vNumLimit
      }
      if (newValue > this.containerWidth - vNumLimit) {
        newValue = this.containerWidth - vNumLimit
      }
      this.setState({
        vNum: newValue
      })
    }
  }

  /**
   * 只要鼠标松开或者离开区域，那么就停止resize
   */
  stopResize = () => {
    this.setState({
      isHResize: false,
      isVResize: false
    })
  }

  render() {
    const hCursor = this.state.isHResize ? 'row-resize' : 'default'
    const hColor = this.state.isHResize ? '#ddd' : '#fff'
    const vCursor = this.state.isVResize ? 'col-resize' : 'default'
    const vColor = this.state.isVResize ? '#ddd' : '#fff'

    return (
      <div className={styles['container']} onMouseUp={this.stopResize} onMouseLeave={this.stopResize}>
        <div id='v_resize_container' className={styles['content']} onMouseMove={this.vResizeOver}>
          <div id='h_resize_container' style={{ width: this.state.vNum, cursor: vCursor }} className={styles['left']}
            >
            左边盒子--业务操作&调用链
          </div>
          <div style={{ left: this.state.vNum, backgroundColor: vColor }} draggable={false} onMouseDown={this.vResizeDown} className={styles['v-resize']} />
          <div style={{ marginLeft: this.state.vNum + 4, cursor: vCursor }} className={styles['right']} onMouseMove={this.hResizeOver}>
            <div style={{ bottom: this.state.hNum + 4, cursor: hCursor }} className={styles['left-top']}>
              应用拓扑图
            </div>
            <div style={{ bottom: this.state.hNum, backgroundColor: hColor }} draggable={false} onMouseDown={this.hResizeDown} className={styles['h-resize']} />
            <div style={{ height: this.state.hNum, cursor: hCursor }} className={styles['left-bottom']}>
              Tabs列表
            </div>
          </div>
        </div>
      </div>
    )
  }
}
