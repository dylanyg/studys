const { get } = require("../utils/http");
const { formatDuring, fixed } = require("../utils/index");
let IntervalId = null;
let imgInterVal = null;
// pages/index/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        petList:[],
        videoList: [],
        countDown:'',
        noCountDown: false,
        timeTemp: ['00', '00', '00', '00'],
        bannerSrc:'3',
        defaultSrc: 'https://static.58.com/lbg/mengchong/image/element/video-default.png'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const that = this;
        that.setData({
            bannerSrc: '3'
        });
        // 加载页面数据
        this.loadDdata();
        // setTimeout(() => {
        //     imgInterVal = setInterval(() => {
        //         that.setData({
        //             bannerSrc: that.data.bannerSrc == '3' ? '4' : '3'
        //         });
        //     }, 300);
        // },5000);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        // console.log('index onhide');
        clearInterval(IntervalId);
        clearInterval(imgInterVal);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},

    // 加载页面数据
    loadDdata() {
    },
    // 倒计时计算
    countDown() {
        const deadLineTemp = new Date(this.data.countDown.replace(/-/g, "/"))*1;
        const nowTimeTemp = new Date()*1;
        const gap = deadLineTemp - nowTimeTemp;
        // console.log(deadLineTemp, nowTimeTemp);
        // console.log('时间差', gap);
        if (gap && gap < 0) {// 活动时间截止
            this.setData({
                noCountDown: true
            });
            return;
        }
        const timeGap = formatDuring(gap);
        const that = this;
        this.setData({
            timeTemp: timeGap
        });
    }
});

/*
**todo
    倒计时  ? 倒计时为零时怎么显示
    底部导航  done
    pic http url处理


    数据接口详情
    {
        code:0,   // 0为数据正常，1为异常
        msg:'展示成功！',
        data:{
            finishTime: '',  // 活动时间
            petList:[{
                city:"北京市",  // 宠物所属城市
                code:"",        // 萌宠号
                focus:18,       // 关注数
                id:"955263925526511616", // 萌宠id
                name:"宠物",    // 宠物名
                portrait:"https://wos.58cdn.com.cn/StQpOnMlStx/message/20180126185349_biQvOP0TaSG",   // 宠物头像
                rank:"1",       // 排行
                sterilization:"",  // 是否绝育
                userId:"1",   // 用户id
                vote:"45"     // 点赞数
                year:0        // 宠物年龄
            }],
            videoList:[{
                city:"北京市",   // 视频所属城市
                createTime:"2018-01-23 14:34:05",  // 视频创建时间
                id:"2",   // 视频id
                petId:"955263925526511616",// 视频所属宠物id
                portrait:"http://pic.58.com/p1/big/n_v2180d5c93d40541bd9e8c9ae28e4f65b6.jpg?w=160&h=120", // 宠物头像
                summary:"一句话介绍还是什么",  // 视频描述
                updateTime:"2018-01-29 16:04:37",  // 视频更新时间
                url:"/video/play/2",  // 视频url
                userId:"1",    // userId
                visit:"181",  // 播放次数
                vote:"2"   // 点赞数
            }]
        }
    }

 */
