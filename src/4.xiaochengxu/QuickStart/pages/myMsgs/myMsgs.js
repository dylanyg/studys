// pages/myMsgs/myMsgs.js
const { get, post } = require('../utils/http');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:1,
        size:10,
        pageTotal:10,
        msgList:[],
        haveMsg:true,
        pulldown:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '我的消息'
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
        this.getMsgList(1)
    },
    //获取排行列表
    getMsgList: function (n) {
        const that = this,
        data = {
            page: that.data.page,
            size:that.data.size
        };
        get('/user/myMessage/', data , (e, response) => {
            if (that.data.pulldown) {
                wx.stopPullDownRefresh();
                that.setData({
                    pulldown: false
                });
            }
            if (e) {
                return false;
            }
            if (n === 1 && response.messages.length <= 0) {
                that.setData({
                    haveMsg:false
                });
                return;
            }
            const pageTotal = Math.ceil(Number(response.totalCount)/that.data.size);
            const nMsgList = n === 1 ? response.messages : [...that.data.msgList,...response.messages];
            that.setData({
                msgList: nMsgList,
                pageTotal: pageTotal
            });
        })
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
        const that = this,
            page = that.data.page;
        if (page === 1) {
            wx.showToast({
                title: '已经到顶啦',
                duration: 2000
            })
            wx.stopPullDownRefresh();
            return;
        }
        that.setData({
            pulldown:true,
            page: page - 1
        });
        // 下拉加载更多
        that.getMsgList(page - 1);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        const that = this,
        page = that.data.page,
        pageTotal = that.data.pageTotal;
        if (page === pageTotal) {
            wx.showToast({
                title: '没有新消息啦',
                duration: 2000
            })
            return;
        }
        that.setData({
            page: page + 1
        });
        // 下拉加载更多
        that.getMsgList(page + 1);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})