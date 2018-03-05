import UploadF from './upload.js'
import { post } from '../utils/http.js'

// pages/report/report.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploading: false,
    showSuccess: false,
    contentLength: 0,
    form: {
      type: [],
      content: '',
      imgUrl: [],
      phone: ''
    },
    model: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let action = this.options.action || 'feedback';
    let videoId = this.options.videoId || '';
    let conf = {
      feedback: {
        title: '意见反馈',
        submitAPI: '/suggestion/save',
        tags: [
          { text: '拍摄问题', checked: false },
          { text: '宠物卡', checked: false },
          { text: '排行榜', checked: false },
          { text: '视频问题', checked: false },
          { text: '推荐视频问题', checked: false },
          { text: '其他问题', checkout: false }
        ],
        tempImg: [],
        showTel: true
      },
      report: {
        title: '举报',
        submitAPI: '/report/add',
        tags: [
          { text: '色情视频', checked: true },
          { text: '暴力视频', checked: false },
          { text: '广告视频', checked: false },
          { text: '非宠物视频', checked: false },
          { text: '其他问题', checkout: false }
        ],
        tempImg: [],
        showTel: false
      }
    }
    let model = {
      action,
      ...conf[action],
      videoId
    }
    wx.setNavigationBarTitle({
      title: model.title,
    })
    this.setData({
      model
    })
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
  checkContent(e) {
    var content = e.detail.value;
    this.setData({
      contentLength: e.detail.value.length,
      form: Object.assign({}, this.data.form, { content })
    })
  },
  setContent(e) {
  },
  setMobile(e) {
    var phone = e.detail.value;
    this.setData({
      form: Object.assign({}, this.data.form, { phone })
    }
    );
  },
  setType(e) {
    let { index } = e.target.dataset;
    let tags = this.data.model.tags;
    tags.map(tag=>tag.checked=false);
    tags[index].checked = !tags[index].checked;
    this.setData({
      model: Object.assign({}, this.data.model, { tags: tags })
    })
  },
  onUploadHander() {
    let page = this;
    let start = this.data.model.tempImg.length || 0;
    let _tempImg = [...this.data.model.tempImg];
    wx.chooseImage({
      success: function (res) {
        page.setData({
          uploading: true
        })
        let total=res.tempFilePaths.length;
        new UploadF({
          tempFiles: res.tempFilePaths,
          onCreate(file, index) {
            _tempImg.push(file);
            page.setData({
              model: Object.assign({}, page.data.model, { tempImg: _tempImg })
            })
          },
          onCompleted(e, data, index) {
            if(total==index+1){
              page.setData({
                uploading: false
              })
            }
            _tempImg = [...page.data.model.tempImg];
            if (e) {
              wx.showToast({
                title: '图片上传失败，请重试',
              })
              _tempImg.splice(start + index, 1);   // 失败删除
            } else {
              _tempImg.splice(start + index, 1, data); // 成功替换
            }
            page.setData({
              model: Object.assign({}, page.data.model, { tempImg: _tempImg })
            })
          }
        })
      }
    })
  },
  onSubmitHandler() {
    let { action, submitAPI, videoId, tags, tempImg } = this.data.model;
    let { content, phone } = this.data.form;
    let _type=tags.map((cur,i)=>cur.checked?i:-1).filter((item)=>item>-1).join('|');
    let _imgurl = tempImg.map(item=>item.uploadImg).join('|');
    let data;
    if (action === 'report') {
      data = {
        videoid: videoId,
        type: _type,
        picurl: _imgurl,
        summary: content
      }
    } else {
      data = {
        phone,
        type: _type,
        imgUrl: _imgurl,
        content
      }
    }
    if (this.data.uploading) {
      wx.showToast({
        title: '图片未提交完成，请稍后...',
        icon: 'none'
      })
      return;
    }
    if (action === 'report' && _type==='') {
      wx.showToast({
        title: '请选择问题分类',
        icon:'none'
      })
      return;
    }
    if (this.data.model.action === 'feedback' && (content==='' || content.length==0)){
      wx.showToast({
        title: '请详细描述问题',
        icon: 'none'
      })
      return;
    }
    let regPhone = /^1[345678][0-9]{9}$/;
    if (!regPhone.test(this.data.form.phone)){
      wx.showToast({
        title: '输入正确的手机号',
        icon: 'none'
      })
    }

    post(submitAPI, data, (e, response) => {
      if (e) {
        wx.showToast({
          title: '提交失败',
        })
      } else {
        this.setData({
          showSuccess: true
        })
      }
    })
  },
  onCancelImage(e) {
    let { index } = e.target.dataset;
    let _tempImg = this.data.model.tempImg.slice(0);
    let {uploadImg,localImg} = this.data.model.tempImg[index];
    if (localImg.indexOf('loading') >= 0 || this.data.uploading) {
      console.log('上传中......');
      return;
    } else {
      console.log('删除上传图片，',index,','+_tempImg[index])
      _tempImg.splice(index, 1);
      this.setData({
        model: Object.assign({}, this.data.model, { tempImg: _tempImg })
      })
    }
  }
})