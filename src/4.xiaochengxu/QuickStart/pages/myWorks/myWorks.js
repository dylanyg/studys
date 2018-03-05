// pages/myWorks/myWorks.js
const http = require('../utils/http.js');
const util = require('../utils/index.js');
// 所有链接
const urls = {
    getWorkData: '/user/myVideo', // 获取作品数据接口
    getOthersWork: '/video/other', // 获取他人的作品列表
    delItem: '/user/video/delete', // 删除作品接口
    focusAdd: '/focus/add', // 增加关注
    focusDel: '/focus/delete', // 取消关注
    getFocus: '/user/myFocus', // 获取关注列表
    otherCard: '/user/otherCard', // 查看别人的宠物卡片，用于判断关注、以及获取该用户信息
    isMyPet: '/user/isMyPet', // 是否为我的宠物

    uploadVideo: '/pages/camera/camera', // 上传视频跳转链接
    videoDetail: '/pages/detail/detail', // 视频详情页
}
// 初始化的页面加载数量
const initPage = 1;
const initPageSize = 10;

// 重新封装get和post
const get = (url, data, callback, flag = false) => {
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
    }, flag);
}
const post = (url, data, callback) => {
    http.post(url, data, (err, data) => {
        if (err) {
            // 返回的错误是个对象
            if (typeof err === 'object') {
                err = err.errMsg;
            }

            console.log(err);
            return;
        }

        // post请求内就不对返回的数据做处理了，因为post请求不一定会返回数据

        callback(data);
    });
}

Page({

    /**
     * 页面的初始数
     */
    data: {
        isOwner: false, // 是否是本人视角
        isEditing: false, // 是否在编辑
        isFocused: false, // 是否关注
        isEmpty: true, // 列表是否为空

        petId: 0,
        page: 1, // 作品列表当前页
        pageSize: 10, // 每页展示数量
        getDataUrl: '',
        otherArgs: {}, // 获取其他人作品数据时需要传的参数

        worksArr: [],
    },

    /**
     * 编辑状态-删除作品
     */
    delItems() {
        const videoIds = this.data.worksArr
            // 筛选出已选择的video
            .filter(item => !!item.checked)
            // 获取其videoId
            .map(item => item.videoId)
            // 将videoId拼接成字符串
            .join(',');

        wx.showModal({
            title: '提示',
            content: '确认删除？',
            success: res => {
                if (res.confirm) {
                    http.post(
                        urls.delItem,
                        {
                            videoIds,
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

                            this.initData();
                        },
                    );
                }
                else if (res.cancel) {
                    this.cancel();
                }
            },
            fail: res => {
                this.cancel();
            }
        })
    },

    /**
     * 编辑状态-选择作品
     */
    selectWork(e) {
        // TODO index数据不存在的情况？
        const selectedIndex = e.target.dataset.index;
        let newWorksArr = this.data.worksArr.concat();
        const selectItem = newWorksArr[selectedIndex];
        selectItem.checked = !selectItem.checked;

        this.setData({
            worksArr: newWorksArr
        });
        newWorksArr = null;
    },

    /**
     * 取消编辑
     */
    cancel() {
        // 重置已选作品
        let newWorksArr = this.data.worksArr.map(item => {
            item.checked = false;
            return item;
        })

        this.setData({
            isEditing: false,
            worksArr: newWorksArr
        })
    },

    /**
     * 编辑
     */
    bindEdit(e) {
        this.setData({
            isEditing: true
        })
    },

    /**
     * 增加关注、取消关注
     */
    bindFocus(e) {
        const isFocused = this.data.isFocused; // 是否关注
        const feedbackMsg = isFocused ? '取消关注成功！' : '关注成功！';
        const petId = this.data.petId;
        const actionUrl = isFocused ? urls.focusDel : urls.focusAdd; // 关注了就取消，未关注就加关注
        http.post(
            actionUrl,
            {
                // 【注意】这里的参数名的i是小写的。。。
                petid: petId
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

                wx.showToast({
                    title: feedbackMsg,
                })
                // 因为接口不会返回其他信息，也没必要重新获取一次关注状态（也没封装这种方法）
                this.setData({
                    isFocused: !isFocused,
                })
            },
        );
    },

    /**
     * 点击分享
     */
    bindShareBtn(e) {

    },

    /**
     * 跳转视频详情
     */
    turnToVideoDetail(e) {
        // 应该传入视频id
        const videoId = e.target.dataset.id;

        wx.navigateTo({
            url: `${urls.videoDetail}?id=${videoId}`,
            success: res => {

            },
            fail: err => {

            },
            complete: res => {

            }
        })
    },

    /**
     * 跳转上传拍摄
     */
    turnToUploadVideo(e) {
        // 应该传入用户信息
        wx.switchTab({
            url: urls.uploadVideo,
            success: res => {

            },
            fail: err => {

            },
            complete: res => {

            }
        })
    },

    /**
     * 上传作品
     */
    uploadWork() {
        wx.showActionSheet({
            itemList: ['相册选择', '直接拍摄'],
            success: res => {
                const tapIndex = res.tapIndex || 0;
                const sourceTypes = ['album', 'camera'];

                // 选择视频
                wx.chooseVideo({
                    sourceType: sourceTypes[tapIndex],
                    success: res => {

                    },
                    fail: res => {

                    },
                    complete: res => {

                    }
                });

            },
            fail: res => {

            }
        });
    },

    /**
     * 初始化数据
     */
    initData({ callback, flag } = {}) {
        http.get(
            this.data.getDataUrl,
            Object.assign(
                {
                    page: initPage,
                    size: initPageSize,
                },
                this.data.otherArgs,
            ),
            (err, data) => {
                // 错误处理
                if (err) {
                    console.log(err);
                    return;
                }

                // 获取的数据有误
                if (!data) {
                    util.alert('错误', '数据加载失败，请稍后再试！');
                    return;
                }

                const isEditing = false;
                let {
                    petId,
                    petname,
                    videos,
                    totalCount
                } = data;
                const isEmpty = totalCount === 0 || !videos;

                this.setData({
                    worksArr: videos,
                    isEditing,
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
     * 客人视角-初始化作品列表主人信息
     * 是否关注
     * 用户名
     * 头像
     */
    initOthersData() {
        http.get(
            urls.otherCard,
            {
                petId: this.data.petId
            },
            (err, data) => {
                // 错误处理
                if (err) {
                    console.log(err);
                }

                const isFocused = data.focus;
                const {
                    username,
                    userImg, // 头像
                } = data.myCardVO && data.myCardVO.userCenterVO;

                // 如果用户信息获取出错，弹出错误框
                if ([username, userImg].some(item => !item)) {
                    util.alert('用户信息获取失败！', '错误');
                    return;
                }

                this.setData({
                    isFocused,
                    username,
                    userImg
                })
            }
        );
    },


    /**
     * 加载更多数据
     */
    loadMoreWorks() {
        http.get(
            this.data.getDataUrl,
            Object.assign(
                {
                    page: ++this.data.page,
                    size: this.data.pageSize,
                },
                this.data.otherArgs
            ),
            (err, data) => {
                // 错误处理
                if (err) {
                    console.log(err);
                }

                // 获取的数据有误
                if (!data) {
                    util.alert('错误', '数据加载失败，请稍后再试！');
                    return;
                }

                const {
                    totalCount,
                    videos,
                } = data;

                const newWorksArr = this.data.worksArr && this.data.worksArr.length && this.data.worksArr.concat(videos);

                this.setData({
                    worksArr: newWorksArr,
                });
            }
        );
    },

    checkIsOwner(petId, callback) {
        if (!petId) {
            callback && callback(true);
            return;
        }

        http.get(urls.isMyPet, { petId }, (err, res) => {
            if (err) {
                console.log(err);
                callback && callback(false);
                return;
            }

            callback && callback(res);
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options);

        const petId = options.petId;

        this.checkIsOwner(petId, res => {
            const isMyPet = res;

            if (isMyPet) {
                this.setData({
                    isOwner: true,
                    getDataUrl: urls.getWorkData
                })
            }
            else {
                wx.setNavigationBarTitle({
                    title: '他的作品',
                })
                this.setData({
                    isOwner: false,
                    petId,
                    getDataUrl: urls.getOthersWork,
                    otherArgs: {
                        petId
                    },
                })
            }

            // 如果不是作品主人，获取宠物卡信息以获取主人信息 及 是否关注
            if (!this.data.isOwner) {
                this.initOthersData(); // 初始化作品列表主人信息
            }

            // 加载数据
            this.initData();
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
        this.initData({
            callback: () => {
                wx.stopPullDownRefresh();
            },
            flag: true
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     * 下拉底部加载更多数据
     */
    onReachBottom: function () {

        // 如果已经全部加载出来了，则不再执行此回调
        if (this.data.worksArr && this.data.worksArr.length >= this.data.totalCount) {
            wx.showToast({
                title: '没有数据啦！',
                icon: 'none',
                duration: 1000
            });

            return;
        }

        this.loadMoreWorks();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '这是我制作的萌宠小视频，快来帮我点赞赢大奖',
            path: '/pages/myWorks/myWorks?petId=' + this.data.petId,
            imageUrl: 'https://static.58.com/lbg/mengchong/image/shareBanner.png',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})