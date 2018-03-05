// pages/rankingArea/rankingArea.js
const { get, post } = require('../utils/http');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        city:'',
        mypetRank:'',
        petRank: '', //0为我的宠物排行无数据 1为有数据
        areaRankList: [],
        havePetCard:true //true为有宠物卡 false为没有宠物卡
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.cityName);
        wx.setNavigationBarTitle({
            title: options.cityName + '排行'
        });
        this.setData({
            city: options.cityName
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
        this.getMypetRank();
        this.getAreaRankList();
        this.havePetCard();
    },
    //获取排行列表
    getAreaRankList: function (n) {
        const that = this;
        const data = {
            city: that.data.city
        };
        get('/rank/pet/list', data , (e, response) => {
            if (e) {
                return false;
            }
            that.setData({
                areaRankList: response
            });
        })
    },
    getMypetRank: function() {
        const that = this;
        get('/rank/pet/rank', (e, response) => {
            if (e) {
                return false;
            }
            const mypetRank = response;
            if (response.rank == -1) {
                that.setData({
                    petRank: 0
                })
                return;
            }
            that.setData({
                mypetRank: mypetRank,
                petRank: 1
            })
        })
    },
    //是否有宠物卡
    havePetCard:function () {
        const that = this;
        get('/user/havePetCard', (e, response) => {
            if (e) {
                console.log(e);
                return false;
            }
            that.setData({
                havePetCard:response
            })
        })
    },

    switchCamera:function() {
        wx.switchTab({
            url: '/pages/camera/camera'
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