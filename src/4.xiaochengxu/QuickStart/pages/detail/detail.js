// pages/detail/detail.js
const { get, post } = require("../utils/http");
const { httpsUrl, alert, toast, alertTips, fixed } = require("../utils/index");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoId: '', // 入口参数
        canIvote:true,
        canIFocus: true,
        dianZanNum: 0, // 点赞数
        guanzhuNum: 0, // 关注数
        visit: 0, // 播放次数
        petInfo: '', // 宠物卡信息
        hotTop: '', // 热门推荐信息
        videoInfo: '', // 视频信息
        isVideo: false, // 视频弹窗是否展示
        poster: '', // 视频封面
        videoSrc: '', // 视频url
        url: '',
        playFlag: false, // 是否播放或播放完成
        hasFocus: false, // 是否关注
        hasVote: false, // 是否点赞
        isCurrentUser: false, // 是否是进入当前登录状态用户的视频详情页
        host: 'https://mengchong.58.com',
        showShareLog: false // 分享弹窗
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options);
        this.setData({
            videoId: (options.scene) ? decodeURIComponent(options.scene).petId : options.id
        });
        // 加载页面数据
        this.loadData();
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

    // 加载页面数据
    loadData() {
        const id = this.data.videoId;
        const that = this;
        const globalUserId = app.globalData.sessionId;
        get('/index/detail', {videoid: id}, (e, response) => {
            if (e) {
                console.log(e);
                return;
            }
            // console.log(response);
            if (!response) {
                alert('视频已被删除！', '提示', () => {
                    wx.reLaunch({
                        url: '/pages/index/index'
                    });
                });
                return;
            };
            // console.log(response);
            that.setData({
                petInfo: response.petRankVo || '',
                videoInfo: response.videoVO || '',
                hotTop: response.list.length > 0 ? response.list : '',
                visit: response.videoVO.formatvisit || '0',
                hasFocus: response.hasFocus || '',
                hasVote: response.hasVote || '',
                dianZanNum: response.videoVO.formatvote || '0',
                videoSrc: this.data.host + response.videoVO.url + '/',
                guanzhuNum: response.petRankVo.focus || 0,
                isCurrentUser: response.currentUser || ''
            });

        });
    }, 

    // 参赛赢大奖
    toGame() {
        wx.navigateTo({
            url: '/pages/activity/activity'
        });
    },
    switchToIndex() {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },

    toFound() {
        wx.switchTab({
            url: '/pages/found/found'
        });
    },

    // 举报页面
    toReport() {
        const id = this.data.videoInfo.id;
        wx.navigateTo({
            url: '/pages/report/report?videoId=' + id + '&action=report'
        });
    },

    // 关注功能
    hasFocus() {
        const hasFocus = this.data.hasFocus;
        const that = this;
        const canIFocus = this.data.canIFocus;

        if (!canIFocus) {
            toast('请不要连续操作，喝口水休息一会儿吧。');
            return;
        };

        if (!hasFocus) {
            // 关注
            that.focus ('/focus/add', '关注成功', '关注', 1);
            return;
        }
        // 取消关注
        that.focus ('/focus/delete', '取消关注', '取消关注', -1);
    },
    focus (url, tips, failTip, flag) {
        const that = this;
        const obj = {
            userid: that.data.petInfo.userId,
            petid: that.data.petInfo.id
        };

        this.setData({ canIFocus: false });
        post(url, obj, (e, response) => {
            setTimeout(() => {
                that.setData({ canIFocus: true });
            }, 3000);

            if (e) {
                alertTips(failTip + '失败！');
                console.log(e);
                return;
            }
            // console.log(response);
            alertTips(tips);
            let guanzhuNum = isNaN(that.data.guanzhuNum*1) ? that.data.guanzhuNum : (flag + that.data.guanzhuNum*1);
            that.setData({
                guanzhuNum,
                hasFocus: flag==1 ? true : false
            });
        }, true);
    },
    // 点赞
    videoVote() {
        const isCurrentUser = this.data.isCurrentUser;
        const hasVote = this.data.hasVote;
        const that = this;
        const canIvote = this.data.canIvote;

        if (!canIvote) {
            toast('请不要连续操作，喝口水休息一会儿吧。');
            return;
        };

        if (!hasVote) {
            // 点赞操作
            that.vote('点赞成功', '点赞', 1);
            return;
        }
        // 取消点赞
        that.vote('取消点赞', '取消点赞', -1);
    },
    vote(tips, failTips, flag) {
        const videoid = this.data.videoId;
        const that = this;
        this.setData({
            canIvote: false
        });
        get('/video/vote', {videoid}, (e, response) => {
            setTimeout(() => {
                that.setData({
                    canIvote: true
                });
            }, 3000);
            if (e) {
                alertTips(failTips + '失败！');
                console.log(e);
                return;
            }
            // console.log(response);
            alertTips(tips);
            let dianZanNum = isNaN(that.data.dianZanNum*1) ? that.data.dianZanNum : (flag + that.data.dianZanNum*1);
            that.setData({
                dianZanNum,
                hasVote: flag==1 ? true : false
            });

        }, true);
    },
    //分享
    showShareLog(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            showShareLog: type == '1' ? true : false
        });
    },
    // 分享到朋友圈
    shareToCircle() {
        const that = this;
        wx.navigateTo({
            url:'../sharecircle/sharecircle?path=pages/detail/detail&videoId=' + that.data.videoId + '&petId=' + that.data.petInfo.id
        });
        this.setData({
            showShareLog: false
        });
    },

    // 视频播放中
    playing() {
        const playFlag = this.data.playFlag;
        let visit = isNaN(this.data.visit*1) ? this.data.visit : (++this.data.visit);
        if (!playFlag) {
            // 计数请求/video/visit
            const videoid = this.data.videoId;
            get('/video/visit', {videoid}, (e, response) => {
                if (e) {
                    console.log(e, '计数失败！');
                    return;
                }
                // console.log(response);
                this.setData({
                    playFlag: true,
                    visit
                });
                // console.log('计数+1',visit);
            });
        }
    },

     // 视频播放结束
    playend() {
        this.setData({
            playFlag: false
        });
        // console.log('播放完毕！',this.data.visit);
    },

    confirm(e) {
        let { formId } = e.detail;
        get('/submitFormId/', { formId, source: 'share' }, () => {}, true)
    }
});
/**
 * 
 * todo 
 * 邀请好友
 * 参赛  done
 * 视频播放  done
 * 举报  done
 * 点赞  done
 * 分享 ???
 * 分享到朋友圈参数
 * 页面url   videoId
 * 关注 done
 * 
 * 
 * 数据接口详情
    {
        code:0,   // 0为数据正常，1为异常
        msg:'展示成功！',
        data:{
            currentUser:false,  // 是否是当前登录身份用户的视频详情
            hasFocus: false,    // 我是否关注过这个视频
            hasVote: false,     // 我是否为这个视频点过赞
            list:[{    // 热门推荐
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
            }],
            petRankVo:{ // 宠物卡片信息
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
            },
            videoRankVO:{   // 宠物视频信息
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
            }
        }
    }
 * 
*/