const { notSupportTips } = require('../utils/index');

const app = getApp();

let host = 'https://mengchong.58.com';

const http = (method, ...props) => {
    let [url, data, callback, noLoading] = props;
    if (typeof data === 'function') {
        noLoading = callback;
        callback = data;
        data = {};
    }

    app.getSessionId((e, sessionId) => {
        console.log('sessionId', sessionId);
        if (e) {
            console.log(e);
            return;
        }

        console.log('发送请求：', sessionId, method, props);

        const sendData = Object.assign({}, data, { sessionId });

        !noLoading && wx.showLoading && wx.showLoading({ title: '加载中', mask: true });
        return wx.request({
            url: host + url + (~url.indexOf('?') ? '' : '?') + (+new Date()).toString(36).substr(3),
            data: sendData,
            method: method,
            dataType: 'json',
            header: {
                "content-type": method === "GET" ? "application/json" : "application/x-www-form-urlencoded"
            },
            success(response) {
                const { code, msg, data } = response.data;
                if (code == 0) {
                    callback && callback(null, data);
                } else if (code == 1000) {
                    app.clearSessionId();
                    callback && callback('登录失效');
                } else {
                    callback && callback(msg);
                }
            },
            fail(e) {
                callback && callback(e);
            },
            complete() {
                !noLoading && wx.hideLoading && wx.hideLoading();
            }
        });
    });
};

module.exports.get = (...props) => {
    return http('GET', ...props);
};

module.exports.post = (...props) => {
    return http('POST', ...props);
};

module.exports.request = () => {
    wx.showNavigationBarLoading && wx.showNavigationBarLoading({title: '加载中'});
    return wx.request({
        url: url,
        complete() {
            wx.hideNavigationBarLoading && wx.hideNavigationBarLoading();
        }
    });
};
