var analytics = require('../../../utils/analytics');
Page({
  onLoad: function() {
    analytics.trackPage('random');
    analytics.startStay('random');
    analytics.trackToolUse('random');
  },
  data: {
    min: 1,
    max: 100,
    count: 1,
    result: null,
    results: [],
    history: []
  },

  onMinChange: function(e) { this.setData({ min: Number(e.detail.value) || 0 }); },
  onMaxChange: function(e) { this.setData({ max: Number(e.detail.value) || 100 }); },
  onCountChange: function(e) {
    var c = Number(e.detail.value) || 1;
    if (c > 100) c = 100;
    if (c < 1) c = 1;
    this.setData({ count: c });
  },

  onGenerate: function() {
    var min = this.data.min; var max = this.data.max; var count = this.data.count;
    if (min > max) {
      wx.showToast({ title: '最小值不能大于最大值', icon: 'none' });
      return;
    }

    var results = [];
    for (var i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    var historyEntry = count === 1
      ? String(results[0])
      : '[' + results.join(', ') + ']';

    this.setData({
      result: results[0],
      results: results,
      history: [historyEntry].concat(this.data.history).slice(0, 50)
    });

    wx.vibrateShort({ type: 'light' });
  },

  onClear: function() {
    this.setData({ history: [], result: null, results: [] });
  },

  onHide: function() { analytics.endStay('random'); },


  onUnload: function() { analytics.endStay('random'); },



  onShareAppMessage: function() {
    return { title: '随机数生成器', path: '/pages/tools/random/index' };
  }
});
