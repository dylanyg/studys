const { alert, trim } = require('../utils/index');
const { get, post } = require('../utils/http');
const { uploader } = require('../utils/uploader');

const sourceTypes = ['camera', 'album'];

Page({
    data: {
        videoTmpPath: '',
        videoPath: '',
        uploading: false,
        progress: 0,
        wordsNum: 0,
    },

    onHide() {
        this.setData({
            videoTmpPath: '',
            videoPath: '',
        });
    },

    reUpload() {
        this.setData({ videoPath: '' });
        this.shoot();
    },
    checkPetCard(callback) {
        const self = this;

        post('/user/havePetCard', (e, res) => {
            if (!res) {
                wx.showModal({
                    showCancel: false,
                    title: '注意',
                    content: '您还没有创建宠物卡，先去创建宠物卡再来拍摄视频吧',
                    success() {
                        wx.navigateTo({ url: '../center/center' });
                    },
                });
                return;
            };

            callback && callback();
        });
    },
    checkForbid(callback) {
        const self = this;

        post('/user/isForbid', (e, res) => {
            if (res) {
                wx.showModal({
                    showCancel: false,
                    title: '注意',
                    content: '您的账号被禁止发布视频。',
                    success() {
                    },
                });
                return;
            };

            callback && callback();
        });
    },
    shoot() {
        const self = this;

        self.checkPetCard(() => {
            self.checkForbid(() => {
                wx.showActionSheet({
                    itemList: ["拍摄（最长15秒，建议横屏）", "从手机相册选择"],
                    success(res) {
                        self.choose(sourceTypes[res.tapIndex]);
                    },
                    fail: function(res) {
                        console.log(res.errMsg);
                    }
                });
            })
        });
    },
    confirmUpload(e) {
        const self = this;
        let { value, formId } = e.detail;
        const videoTitle = trim(value.videoTitle);
        const { videoPath } = self.data;

        if (!videoPath) {
            alert('请先选择视频，然后再上传。');
            return;
        }

        if (!videoTitle) {
            alert('请输入小视频描述。');
            return;
        }

        if (videoTitle.length > 20) {
            alert('描述最多20个字。');
            return;
        }

        post('/video/add/', {
            url: videoPath, summary: videoTitle,
        }, (e, res) => {
            if (e) {
                self.fail();
                return;
            }

            console.log(e, res);
            wx.navigateTo({ url: '../detail/detail?id=' + res });
        });
    },
    choose(sourceType) {
        const self = this;

        wx.chooseVideo({
            sourceType: [sourceType],
            maxDuration: 15,
            success(res) {

                const { tempFilePath, duration } = res;

                self.setData({
                    uploading: true,
                    progress: 0
                });
                self.upload(tempFilePath, duration);
            },
            fail(e) {
                alert('视频上传失败，请从相册选择。', '提示', () => {
                    self.shoot();
                });
                console.log(e);
            }
        });
    },
    upload(tempFilePath, duration) {
        const self = this;

        if (duration > 15) {
            self.setData({
                uploading: false
            });
            alert('小视频最长15秒，请重新拍摄。');
            return;
        }

        const _uploader = uploader(tempFilePath, (e, res) => {
            self.setData({ uploading: false });
            if (e) {
                self.fail();
                return;
            }
            self.setData({
                videoTmpPath: tempFilePath,
                videoPath: res.data
            });
        }, true);

        _uploader.onProgressUpdate(({ progress }) => {
            self.setData({
                progress,
            });
        });
    },
    fail() {
        alert('视频上传失败，请您重试。', '提示', () => {
            this.reUpload();
        });
    },
    confirmShoot(e) {
        let { formId } = e.detail;
        get('/submitFormId/', { formId, source: 'shoot' }, () => {}, true)
    },
    checkLimit(e) {
        const curLen = e.detail.value.length;
        this.setData({
            wordsNum: curLen,
        });
    }
});
