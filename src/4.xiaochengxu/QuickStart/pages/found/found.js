const { get, post } = require("../utils/http");
let time = 0,
    touchDot = 0,
    touchDotY = 0,
    scrollY = 0,
    interval = "";
// pages/found/found.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videos: [],
        tabs: [{
            name: '热门推荐',
            index: 1,
            type: ''
        }, {
            name: '本地视频',
            index: 2,
            type: ''
        }, {
            name: '狗狗',
            index: 3,
            type: 1
        }, {
            name: '猫咪',
            index: 4,
            type: 2
        }, {
            name: '其他',
            index: 5,
            type: 0
        }],
        tabUrls: ['/explor/hot', '/explor/local', '/explor/type', '/explor/type', '/explor/type'],
        initPageNum: 1,
        loadedPageNum: 1,
        pagesize: 20,
        currentType: 1,
        isHideLoading: true,
        currentPageNum: 1,
        allowLoading: true,
        notempty: true,
        withLocal : true
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
    withoutLocal : function(){
        this.setData({
            tabUrls: ['/explor/hot', '/explor/type', '/explor/type', '/explor/type'],
            tabs: [{
                name: '热门推荐',
                index: 1,
                type: ''
            }, {
                name: '狗狗',
                index: 2,
                type: 1
            }, {
                name: '猫咪',
                index: 3,
                type: 2
            }, {
                name: '其他',
                index: 4,
                type: 0
            }],
            withLocal : false
        });
    },
    withLocal : function(){
        this.setData({
            tabUrls: ['/explor/hot', '/explor/local', '/explor/type', '/explor/type', '/explor/type'],
            tabs: [{
                name: '热门推荐',
                index: 1,
                type: ''
            }, {
                name: '本地视频',
                index: 2,
                type: ''
            }, {
                name: '狗狗',
                index: 3,
                type: 1
            }, {
                name: '猫咪',
                index: 4,
                type: 2
            }, {
                name: '其他',
                index: 5,
                type: 0
            }],
            withLocal : true
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        get('/user/havePetCard', '', (e, response) => {
            console.log(response);
            if(!response){
                this.withoutLocal();
            }else{
                this.withLocal();
            }
            let index = this.data.currentType,
                url = this.data.tabUrls[index - 1],
                submitData = { page: this.data.initPageNum, pagesize: this.data.pagesize };
            if (index == this.data.tabs.length || index == this.data.tabs.length-1 || index == this.data.tabs.length-2) {
                let tab = this.data.tabs[index - 1];
                submitData.type = tab['type'];
            }
            this.freshByTab(url, submitData);
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 获取列表数据的方法
     */
    loadVideo: function (postData) {
        get('/explor/hot', postData, (e, response) => {
            if (!response) {
                this.setData({
                    allowLoading: false,
                    videos: Object.assign([], []),
                    currentPageNum: 1
                });
            } else if (response && response.length < this.data.pagesize) {
                this.setData({
                    allowLoading: false,
                    videos: Object.assign([], response),
                    currentPageNum: 1
                });
            } else {
                this.setData({
                    allowLoading: true,
                    videos: Object.assign([], response),
                    currentPageNum: 1
                });
            }
        })
    },
    /**
     * 点击tab切换类别
     */
    tapClicked: function (type) {
        let tabType = type.target.dataset.index || '';
        if (!tabType) return;
        this.setData({
            currentType: tabType
        });
        let submitData = { page: this.data.initPageNum, pagesize: this.data.pagesize };
        if (tabType == this.data.tabs.length || tabType == this.data.tabs.length-1 || tabType == this.data.tabs.length-2) {
            submitData.type = type.target.dataset.type;
        }
        this.freshByTab(this.data.tabUrls[tabType - 1], submitData);
    },
    /**
     * 切tab时候的请求处理
     */
    freshByTab: function (url, submitData, flag) {
        get(url, submitData, (e, response) => {
            wx.stopPullDownRefresh();
            if (!response || response.length == 0) {
                this.setData({
                    allowLoading: false,
                    videos: Object.assign([], []),
                    currentPageNum: 1,
                    notempty: false
                });
            } else if (response && response.length < this.data.pagesize) {
                this.setData({
                    allowLoading: false,
                    videos: Object.assign([], response),
                    currentPageNum: 1,
                    notempty: true
                });
            } else {
                this.setData({
                    allowLoading: true,
                    videos: Object.assign([], response),
                    currentPageNum: 1,
                    notempty: true
                });
            }
        }, flag || '');
    },
    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        let index = this.data.currentType,
            url = this.data.tabUrls[index - 1],
            submitData = { page: this.data.initPageNum, pagesize: this.data.pagesize };
        if (index == this.data.tabs.length || index == this.data.tabs.length-1 || index == this.data.tabs.length-2) {
            let tab = this.data.tabs[index - 1];
            submitData.type = tab['type'];
        }
        this.freshByTab(url, submitData,true);
    },
    /**
     * 上拉加载更多
     */
    onReachBottom: function () {
        this.setData({
            isHideLoading: false
        })
        let index = this.data.currentType,
            url = this.data.tabUrls[index - 1],
            submitData = { page: this.data.currentPageNum + 1, pagesize: this.data.pagesize };
        this.setData({
            currentPageNum: submitData.page
        });
        if (index == this.data.tabs.length || index == this.data.tabs.length-1 || index == this.data.tabs.length-2) {
            let tab = this.data.tabs[index - 1];
            submitData.type = tab['type'];
        }
        this.loadMore(url, submitData);

    },
    /**
     * 上拉加载更多的请求处理，主要是参数不同
     */
    loadMore: function (url, submitData) {
        if (!this.data.allowLoading && submitData.page > 1) {
            wx.showToast({
                title: '没有数据啦！',
                icon: 'none',
                duration: 1000
            });
            this.setData({
                isHideLoading: true
            });
            return;
        }
        get(url, submitData, (e, response) => {
            if (response && response.length <= this.data.pagesize) {
                this.setData({
                    allowLoading: false
                });
            }
            let datas = this.data.videos;
            this.setData({
                videos: Object.assign([], datas.concat(response)),
                isHideLoading: true
            });
        })
    },
    // 触摸开始事件
    touchStart: function (e) {
        touchDot = e.touches[0].pageX; // 获取触摸时的原点
        touchDotY = e.touches[0].pageY; // 获取触摸时的原点
        // 使用js计时器记录时间    
        interval = setInterval(function () {
            time++;
        }, 100);
    },
    // 触摸结束事件
    touchEnd: function (e) {
        let touchMove = e.changedTouches[0].pageX,
            touchMoveY = e.changedTouches[0].pageY,
            submitData = { page: this.data.initPageNum, pagesize: this.data.pagesize },
            tabType = this.data.currentType;
        scrollY = touchMoveY - touchDotY;
        // 向左滑动   
        if (touchMove - touchDot <= -30 && time < 60 && Math.abs(scrollY) < 50) {
            //执行切换页面的方法
            console.log("向左滑动");
            tabType++;
            if (tabType >= 6) {
                this.clearHand();
                return;
            } else {
                this.setData({
                    currentType: tabType
                });
            }
            if (tabType && tabType == this.data.tabs.length || tabType == this.data.tabs.length-1 || tabType == this.data.tabs.length-2) {
                submitData.type = this.data.tabs[tabType - 1].type;
            }
            this.freshByTab(this.data.tabUrls[tabType - 1], submitData);
        }
        // 向右滑动   
        if (touchMove - touchDot >= 30 && time < 60 && Math.abs(scrollY) < 50) {
            //执行切换页面的方法
            console.log("向右滑动");
            tabType--;
            if (!tabType) {
                this.clearHand();
                return;
            } else {
                this.setData({
                    currentType: tabType
                });
            }
            if (tabType && tabType == this.data.tabs.length || tabType == this.data.tabs.length-1 || tabType == this.data.tabs.length-2) {
                submitData.type = this.data.tabs[tabType - 1].type;
            }
            this.freshByTab(this.data.tabUrls[tabType - 1], submitData);
        }
        this.clearHand();
    },
    clearHand: function () {
        clearInterval(interval); // 清除setInterval
        time = 0;
        scrollY = 0;
    }
})