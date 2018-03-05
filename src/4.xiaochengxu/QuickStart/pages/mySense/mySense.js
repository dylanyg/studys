// pages/mySense/mySense.js
const http = require('../utils/http.js');
const util = require('../utils/index.js');
const urls = {
    petCenter: '/pages/center/center', // 宠物详情页

    getFocusData: '/user/myFocus', // 获取关注列表
}

// 初始化的页面加载数量
const initPage = 1;
const initPageSize = 10;

// 重新封装get和post
const get = (url, data, callback) => {
    http.get(url, data, (err, data) => {
        if (err) {
            // 返回的错误是个对象
            if (typeof err === 'object') {
                err = err.errMsg;
            }

            console.log(err);
            return;
        }

        // 获取的数据有误
        if (!data) {
            util.alert('错误', '数据加载失败，请稍后再试！');
            return;
        }

        callback(data);
    });
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEmpty: true, // 列表是否为空
        followsArr: [],
        totalCount: 999,

        page: 1,
        pageSize: 10,

    },

    /**
     * 跳转宠物详情页
     */
    turnToCenter(e) {
        const petId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `${urls.petCenter}?petId=${petId}`,
            success: res => {

            },
            fail: res => {

            }
        })
    },

    /**
     * 加载更多数据
     */
    loadMore() {
        http.get(
            urls.getFocusData,
            {
                page: ++this.data.page,
                size: this.data.pageSize,
            },
            (err, data) => {
                if (err) {
                    // 返回的错误是个对象
                    if (typeof err === 'object') {
                        err = err.errMsg;
                    }

                    console.log(err);
                    return;
                }

                const {
                    totalCount,
                    pets,
                } = data;

                const newFollowsArr = this.data.followsArr && this.data.followsArr.length && this.data.followsArr.concat(pets);

                this.setData({
                    followsArr: newFollowsArr,
                });
            },
        );
    },

    /**
     * 初始化数据
     */
    initData({ callback, flag } = {}) {

        http.get(
            urls.getFocusData,
            {
                page: initPage,
                size: initPageSize,
            },
            (err, data) => {
                if (err) {
                    // 返回的错误是个对象
                    if (typeof err === 'object') {
                        err = err.errMsg;
                    }

                    console.log(err);
                    return;
                }

                const {
                    pets,
                    totalCount,
                } = data;
                const isEmpty = totalCount === 0 || !pets.length;

                this.setData({
                    followsArr: pets,
                    totalCount,
                    page: initPage,
                    pageSize: initPageSize,
                    isEmpty,
                });

                callback && callback();
            },
            flag,
        );
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 实时刷新数据
        this.initData();
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
        this.initData({
            callback: () => {
                wx.stopPullDownRefresh();
            },
            flag: true
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // 如果已经全部加载出来了，则不再执行此回调
        if (this.data.followsArr && this.data.followsArr.length >= this.data.totalCount) {
            wx.showToast({
                title: '没有数据啦！',
                icon: 'none',
                duration: 1000
            });

            return;
        }

        this.loadMore();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})