// pages/ranking/ranking.js
const { get, post } = require('../utils/http');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mypetRank:'',
        videoId: '', // 有一个宠物的时候，videoid存起来
        rankList: '',
        petRank: '', //0为无数据 1为有数据
        havePetCard:true, //true为有宠物卡 false为没有宠物卡
        showShareLog: false // 分享弹窗
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '排行'
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
        this.getRankList();
        this.getMypetRank();
        this.havePetCard();
    },
    //获取排行列表
    getRankList: function () {
        const that = this;
        get('/rank/summar/list', (e, response) => {
            if (e) {
                return false;
            }
            const length = response.length,
                rankList = response;
            if (length <= 0) {
                that.setData({
                    taskData: 0
                })
                return;
            }
            that.setData({
                rankList: rankList
            })
        })
    },
    //获取我的宠物排行
    getMypetRank: function(){
        const that = this;
        get('/rank/pet/rank',(e, response) => {
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
                petRank: 1,
                videoId: response.videoid ? response.videoid : ''
            })
        })
    },
    //是否有宠物卡
    havePetCard:function () {
        const that = this;
        get('/user/havePetCard', (e, response) => {
            if (e) {
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
    onShareAppMessage: function (res) {
        return{
            title: '这是我制作的萌宠小视频，快来帮我点赞赢大奖',
            path: '/pages/detail/detail?id=' + this.data.videoId,
            imageUrl:'https://static.58.com/lbg/mengchong/image/shareBanner.png',
            success(res) {
                console.log('转发成功！');
            },
            fail(res) {
                // alert('转发失败！');
            }
        };
    },
})