module.exports = {
    // 图片域名
    picSrcDomain() {
        const n = parseInt(Math.random() * 8) + 1;
        return `https://pic${n}.58cdn.com.cn`;
    },

    // 预览图片
    previewImage(imgs, index) {
        const urls = imgs.map(img => {
            const url = img.split("?")[0];
            return url + "?w=750&h=1000";
        });
        console.log(urls, imgs, index);
        wx.previewImage({
            current: urls[index],
            urls
        });
    },

    // 数字超过1万格式转化
    fixed(num) {
        if (num < 10000) {
            return num;
        } else {
            let nNum = (num / 10000).toString();
            return Math.floor(nNum * 100)/100 + 'w';
        }
    },

    // 倒计时
    formatDuring(mss) {
        const days = parseInt(mss / (1000 * 60 * 60 * 24));
        const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = parseInt((mss % (1000 * 60)) / 1000);
        return [days > 9 ? days : '0' + days, hours > 9 ? hours : '0' + hours, minutes > 9 ? minutes : '0' + minutes, seconds > 9 ? seconds : '0' + seconds];
    },

    // alert
    alert(content, title, callBack) {
        wx.showModal({
            showCancel: false,
            title: title || '注意',
            content,
            success(res) {
                // console.log(res);
                if (res.confirm) {
                    callBack && callBack();
                }
            }
        });
    },

    // toast
    toast(title) {
        wx.showToast({
            title,
            icon: 'none',
            duration: 2000,
        });
    },

    // alert
    alertTips(title, icon) {
        wx.showToast({
            title: title,
            duration: 2000,
            icon: icon || 'success',
        });
    },

    trim(content) {
        if (!content) return '';
        return content.replace(/(^\s*)|(\s*$)/g, "");
    },

    // 头像变成https
    httpsUrl(url) {
        if (/^https/.test(url)) {
            return url
        } else {
            return url.replace(/^http:\/\/|^\/\//, 'https://')
        }
    }
};