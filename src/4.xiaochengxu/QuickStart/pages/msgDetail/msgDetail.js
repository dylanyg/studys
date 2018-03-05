// pages/myMsgs/myMsgs.js
const { get, post } = require('../utils/http');
const { picSrcDomain } = require('../utils/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageDetail:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        wx.setNavigationBarTitle({
            title: '我的消息'
        })
        get('/user/messageDetail', { messageId : options.messageId} , (e, response) => {
            if (e) {
                console.log(e);
                return false;
            }
            that.setData({
                messageDetail:response
            })
        });
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

    }
})