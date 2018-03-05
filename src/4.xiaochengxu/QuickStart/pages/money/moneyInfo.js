const { get, post } = require('../utils/http');

const size = 10;
let page = 1;
let isLoading = false;

Page({
    data: {
        list: [],
    },

    onShow: function() {
        this.loadList();
    },

    onPullDownRefresh: function() {
        this.loadList();
    },

    onReachBottom: function () {
        if (isLoading) return;

        page += 1;
        this.loadList();
    },

    loadList() {
        isLoading = true;
        post('/user/payflow/', { page, size }, (e, { payFlows, totalCount }) => {
            isLoading = false;
            if (e || totalCount === 0) return;

            this.setData({
                list: this.data.list.concat(payFlows)
            });
        });
    },
});
