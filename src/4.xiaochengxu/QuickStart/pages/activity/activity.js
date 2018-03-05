import { get } from '../utils/http.js'

// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openActivity:false,
    VideoCount: 0,
    Video: {},
    Countdown: ['00', '00', '00', '00']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let timer = null;
    let _this = this;
    let result = {
      VideoCount: 0,
      Video: {},
      Countdown: ['00', '00', '00', '00']
    }
    // 我的视频
    get('/user/myVideo', { page: 1, size: 1 }, (e, response) => {
      if (e) {
        return;
      }
      result.VideoCount = response.totalCount;
      result.Video = response.totalCount > 0 ? response.videos[0] : {};
      _this.setData({
        ...result
      })
      // 活动信息
      get('/index/show', (e, response) => {
        if (e) {
          console.log(e);
          return;
        }
        if (!response || response=="") return;
        const activityTime = new Date(response.finishTime.match(/\d{4}-\d{2}-\d{2}/)[0].replace(/-/g, "/")).getTime();
        let _zero = this.dealZero;
        if(Date.now()>=activityTime){
            _this.setData({
              openActivity:true
            })
            return;
        }
        timer = setInterval(function () {
          let curTime = Date.now();
          let Countdown = [];
          if (activityTime - curTime <= 0) {
            clearInterval(timer);
          }
          [activityTime - curTime, 1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000].reduce(function (prev, current) {
            if (!prev) {
              prev = activityTime - curTime;
            }
            if ((prev % current) > 0) {
              Countdown.push(_zero(Math.floor(prev / current)));
            } else {
              Countdown.push(_zero(Math.ceil(prev / current)));
            }
            return prev % current;
          })
          Countdown = Countdown.map((item, i) => {
            if (i == 0) {
              item = item.replace(/^0/, '');
            }
            return item;
          })
          Countdown.length = 4;
          _this.setData(
            {
              Countdown: Countdown
            }
          )
        }, 1000)
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
        path: '/pages/detail/detail?id=' + this.data.Video.videoId + '&share=true',
        imageUrl: 'https://static.58.com/lbg/mengchong/image/shareBanner.png',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }

  },
  /**
   * 小于10添加0
   */
  dealZero(num) {
    return num < 10 ? '0' + num : num + '';
  }
})