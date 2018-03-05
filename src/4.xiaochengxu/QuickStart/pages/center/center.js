import { get,post } from '../utils/http.js'
import { picSrcDomain } from '../utils/index.js'
import LoadData from './loadData.js'

// pages/center/center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromShare:false,
    openActivity:false,
    videoDefault:'https://static.58.com/lbg/mengchong/image/element/video-default.png',
    showEdit:true,
    showShareMenu:false  // 是否显示分享上拉框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    let petId = this.options.petId || scene.petId || '';
    let fromShare = (scene && petId) || false;
    this.setData({
      petId,
      fromShare
    })
    console.log('scene',options.scene);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let petId = this.data.petId;
    let _this=this;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title:'这是我制作的萌宠小视频，快来帮我点赞赢大奖',
        path: '/pages/center/center?petId=' + this.data.CenterCard.userCenterVO.pet.id+'&share=true',
        imageUrl:'https://static.58.com/lbg/mengchong/image/shareBanner.png',
        success: function (res) {
          // 转发成功
          wx.showToast({
            title: '分享成功'
          })
        },
        fail: function (res) {
          // 转发失败
          console.log(res);
          wx.showToast({
            title: '分享失败'
          })
        }
      }
    }
  },
  /**
   * 关注他
   */
  onSenseHandler: function (){
    // to do:
    let data={
      petid: this.data.CenterCard.userCenterVO.pet.id||''
    }
    let API='/focus/add';
    if(this.data.isFocus){
      API ='/focus/delete';
    }
    post(API,data,(e,response)=>{
      if(e){
        wx.showToast({
          title: '失败，请重试',
          icon: 'success',
          duration: 2000
        })
        return;
      }
      this.setData({
        isFocus: !this.data.isFocus
      })
    },true)
  },
  onShowShareSheet (){
    this.setData({
      showShareMenu:true
    })
  },
  onCancelShareSheet (){
    this.setData({
      showShareMenu: false
    })
  }
})