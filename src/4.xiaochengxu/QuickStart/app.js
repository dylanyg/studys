//app.js
App({
  onLaunch: function (params) {
      console.log(params);

    // 读取第三方配置
    if (wx.getExtConfigSync) {
      this.globalData.extConfig = wx.getExtConfigSync();
    }
    wx.getSystemInfo({
      success: function (res) {
        console.log('-------------微信参数列表-------------')
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.screenWidth)
        console.log(res.screenHeight)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })

    console.log('------手机及EXT信息--v1.2----');
    console.log(wx.getSystemInfoSync());
    console.log(wx.getExtConfigSync());
  },
  globalData: {
    userInfo: null,
    information: {},
    extConfig: {}
  },
})