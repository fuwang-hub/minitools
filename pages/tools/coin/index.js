var analytics = require('../../../utils/analytics');
Page({
  onLoad: function() {
    analytics.trackPage('coin');
    analytics.startStay('coin');
    analytics.trackToolUse('coin');
  },
  data: {
    result: null,
    flipping: false,
    history: [],
    headCount: 0,
    tailCount: 0,
    headRate: '0'
  },

  onFlip: function() {
    if (this.data.flipping) return;
    this.setData({ flipping: true });

    var that = this;
    setTimeout(function() {
      var result = Math.random() < 0.5 ? 0 : 1;
      var history = [result].concat();
      var headCount = history.filter(function(v) { return v === 0; }).length;
      var tailCount = history.length - headCount;
      var headRate = (headCount / history.length * 100).toFixed(1);

      this.setData({
        result: result,
        flipping: false,
        history: history,
        headCount: headCount,
        tailCount: tailCount,
        headRate: headRate
      });

      wx.vibrateShort({ type: 'medium' });
    }, 700);
  },

  onClear: function() {
    this.setData({
      result: null,
      history: [],
      headCount: 0,
      tailCount: 0,
      headRate: '0'
    });
  },

  onHide: function() { analytics.endStay('coin'); },


  onUnload: function() { analytics.endStay('coin'); },



  onShareAppMessage: function() {
    return { title: '抛硬币 - 让命运帮你做决定', path: '/pages/tools/coin/index' };
  }
});
