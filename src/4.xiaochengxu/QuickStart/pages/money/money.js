const { get, post } = require('../utils/http');
const { alert } = require('../utils/index');
const app = getApp();

Page({
    data: {
        balance: 0
    },

    onShow() {
        get('/user/balance/', (e, data) => {
            if (e) return;

            this.setData({
                balance: data,
            });
        });

        const openId = app.getWithdrawOpenId();
        if (this.data.balance > 0 && openId) {
            this.withdraw(openId);
        }
    },

    onLoad() {
        app.clearWithdrawOpenId();
    },
    onUnload() {
        app.clearWithdrawOpenId();
    },
    onHide() {
        app.clearWithdrawOpenId();
    },

    moneyPocket() {
        const self = this;

        wx.navigateToMiniProgram({
            appId: 'wxdae99f838bc88b23',
            // envVersion: 'trial',
            success(res) {
                console.log('ok:', res);
            },
            complete(res) {
                console.log('done', res);
            }
        });
    },
    confirm(e) {
        let { formId } = e.detail;
        get('/submitFormId/', { formId, source: 'money' }, () => {}, true);
    },
    withdraw(openId) {
        console.log(app.globalData);
        post('/user/withdraw/', { openId },  (e, data) => {
            console.log(e, data);
            app.clearWithdrawOpenId();

            if (!e) {
                this.setData({ balance: 0 });
            }

            wx.showModal({
                showCancel: false,
                title: '注意',
                content: e ? '提现失败，请稍候再试。' : '提现成功。',
                success() {
                },
            });
        });
    },
})