var analytics = require('../../../utils/analytics');
// pages/tools/exchange/index.js
// 使用免费汇率API: https://open.er-api.com (无需Key，每日更新)
var CURRENCIES = [
  { code: 'CNY', name: '人民币', emoji: '🇨🇳', symbol: '¥' },
  { code: 'USD', name: '美元', emoji: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: '欧元', emoji: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: '英镑', emoji: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: '日元', emoji: '🇯🇵', symbol: '¥' },
  { code: 'KRW', name: '韩元', emoji: '🇰🇷', symbol: '₩' },
  { code: 'HKD', name: '港币', emoji: '🇭🇰', symbol: 'HK$' },
  { code: 'TWD', name: '新台币', emoji: '🇹🇼', symbol: 'NT$' },
  { code: 'SGD', name: '新加坡元', emoji: '🇸🇬', symbol: 'S$' },
  { code: 'AUD', name: '澳元', emoji: '🇦🇺', symbol: 'A$' },
  { code: 'CAD', name: '加元', emoji: '🇨🇦', symbol: 'C$' },
  { code: 'THB', name: '泰铢', emoji: '🇹🇭', symbol: '฿' },
  { code: 'MYR', name: '林吉特', emoji: '🇲🇾', symbol: 'RM' },
  { code: 'RUB', name: '卢布', emoji: '🇷🇺', symbol: '₽' },
  { code: 'INR', name: '印度卢比', emoji: '🇮🇳', symbol: '₹' },
  { code: 'CHF', name: '瑞士法郎', emoji: '🇨🇭', symbol: 'Fr' }
];

Page({
  data: {
    currencies: CURRENCIES,
    fromIdx: 0,  // CNY
    toIdx: 1,    // USD
    fromAmount: '',
    toAmount: '',
    rate: 0,
    rateText: '',
    updateTime: '',
    loading: false,
    rates: null // 缓存的汇率数据
  },

  onLoad: function () {
    analytics.trackPage('exchange');
    analytics.trackToolUse('exchange'); this.fetchRates(); },

  fetchRates: function () {
    var that = this;
    var fromCode = CURRENCIES[this.data.fromIdx].code;
    this.setData({ loading: true });

    // 先检查缓存（1小时有效）
    var cached = wx.getStorageSync('exchange_rates_' + fromCode);
    if (cached && (Date.now() - cached.time < 3600000)) {
      that.setData({ rates: cached.rates, loading: false });
      that.updateRate();
      that.setData({ updateTime: cached.updateTime });
      return;
    }

    wx.request({
      url: 'https://open.er-api.com/v6/latest/' + fromCode,
      success: function (res) {
        if (res.data && res.data.result === 'success') {
          var updateTime = res.data.time_last_update_utc || '';
          // 简化时间显示
          if (updateTime) {
            var d = new Date(updateTime);
            updateTime = (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':00 更新';
          }
          that.setData({ rates: res.data.rates, updateTime: updateTime });
          // 缓存
          wx.setStorageSync('exchange_rates_' + fromCode, { rates: res.data.rates, time: Date.now(), updateTime: updateTime });
          that.updateRate();
        }
      },
      fail: function () {
        wx.showToast({ title: '获取汇率失败', icon: 'none' });
      },
      complete: function () {
        that.setData({ loading: false });
      }
    });
  },

  updateRate: function () {
    if (!this.data.rates) return;
    var toCode = CURRENCIES[this.data.toIdx].code;
    var rate = this.data.rates[toCode] || 0;
    var fromCur = CURRENCIES[this.data.fromIdx];
    var toCur = CURRENCIES[this.data.toIdx];
    var rateText = '1 ' + fromCur.code + ' = ' + rate.toFixed(4) + ' ' + toCode;
    this.setData({ rate: rate, rateText: rateText });
    // 如果有输入金额，重新计算
    if (this.data.fromAmount) {
      var val = parseFloat(this.data.fromAmount);
      if (val > 0) {
        this.setData({ toAmount: (val * rate).toFixed(2) });
      }
    }
  },

  onFromAmountInput: function (e) {
    var val = e.detail.value;
    this.setData({ fromAmount: val });
    var num = parseFloat(val);
    if (num > 0 && this.data.rate) {
      this.setData({ toAmount: (num * this.data.rate).toFixed(2) });
    } else {
      this.setData({ toAmount: '' });
    }
  },

  onToAmountInput: function (e) {
    var val = e.detail.value;
    this.setData({ toAmount: val });
    var num = parseFloat(val);
    if (num > 0 && this.data.rate) {
      this.setData({ fromAmount: (num / this.data.rate).toFixed(2) });
    } else {
      this.setData({ fromAmount: '' });
    }
  },

  onFromChange: function (e) {
    this.setData({ fromIdx: parseInt(e.detail.value), rates: null });
    this.fetchRates();
  },

  onToChange: function (e) {
    this.setData({ toIdx: parseInt(e.detail.value) });
    this.updateRate();
  },

  swapCurrency: function () {
    var from = this.data.fromIdx;
    var to = this.data.toIdx;
    this.setData({ fromIdx: to, toIdx: from, fromAmount: this.data.toAmount, toAmount: this.data.fromAmount, rates: null });
    this.fetchRates();
  },

  onShareAppMessage: function () {
    analytics.trackShare('friend', 'exchange');
    return { title: '汇率换算 - 实时汇率查询', path: '/pages/tools/exchange/index' };
  }
});
