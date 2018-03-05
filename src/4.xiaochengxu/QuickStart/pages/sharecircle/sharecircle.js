import { get } from '../utils/http.js'
import { picSrcDomain } from '../utils/index.js'

// pages/sharecircle/sharecircle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareQrCode:'https://static.58.com/lbg/mengchong/image/element/share-qr-default.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    let petId=this.options.petId||'';
    let videoId = this.options.videoId || '';
    let sharePath = videoId === '' ?'pages/center/center' : this.options.path;
    let data={
      'id': petId || '',
      'path': sharePath,
      'scene': { videoId, petId}
    }
    get('/share/',data,(e,response)=>{
      if(e || !response){
        console.log(e);
        return;
      }
      _this.saveShare(response);
      this.setData({
        PetCard:response
      })
      console.log('sharecircle:',response)
    },true)
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
  onShareAppMessage: function () {
  
  },
  saveShare(uri){
      this.checkAuth(()=>{
        wx.getImageInfo({
          src: uri,
          success:function (res){
            console.log(2,res.path);
            wx.saveImageToPhotosAlbum({
              filePath: res.path,
              success (e){
                console.log(3);
                wx.showModal({
                  title: '',
                  content: '分享图已自动保存到相册，请到微信发朋友圈',
                  showCancel:false,
                })
              },
              fail(res){
                console.error(res);
                wx.showToast({
                  title: '二维码保存失败',
                  icon: 'none'
                })
              }
            })
          },
          fail:function (res){
            console.error(res);
            wx.showToast({
              title: '图片不正确',
              icon: 'none'
            })
          }
        })
      })
  },
  checkAuth(callback){
    console.log('author',1)
    wx.getSetting({
      success(res) {
        console.log('author', 2)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log('author', 3)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('author', 4)
              callback && callback();
            },fail(res){
              console.log(6,res)
              wx.showModal({
                title: '',
                content: '由于您拒绝了相册授权，无法自动保存到本地相册，请截图保存',
                showCancel:false,
              })
            }
          })
        }else{
          console.log('author', 5)
          callback && callback();
        }
      },
      fail(err){
        console.log('author',err)
      }
    })
  }
})