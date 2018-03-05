// pages/myPrize/myPrize.js
const { get, post } = require('../utils/http');
const { picSrcDomain, formatDuring } = require('../utils/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status:0,//0为未开奖 1为已开奖
        winPrize:0,//0为未获奖 1为获奖
        prizeMsg:'',
        timeArray:'',
        timeEnd:'',
        showTime:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '我的奖品'
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
        this.getPrize();
    },

    getPrize: function () {
        const that = this;
        get('/user/myAwards', (e, response) => {
            if (e) {
                console.log(e);
                return false;
            }
            const status = response.status;
            if(status){//status为1 已开奖
                that.setData({
                    prizeMsg:response
                });
                return;
            }
            //未开奖
            const timeEnd = parseInt(new Date(response.finishTime.replace(/-/g, "/")) * 1);
            //console.log(timeEnd);
            that.setData({
                timeEnd:timeEnd
            });
            //未开奖倒计时开始
            if(that.data.timeEnd){
                setInterval(() => {
                    that.countDown();
                },1000)
            }else{
                clearInterval(() => {
                    that.countDown();
                })
            }
        })
    },
    //计时器
    countDown: function () {
        const tineNow = parseInt(new Date() * 1);
        const timeEnd = this.data.timeEnd;
        const deadTime = timeEnd - tineNow;
        this.setData({
            deadTime:deadTime,
            timeArray:formatDuring(deadTime),
            showTime:true
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