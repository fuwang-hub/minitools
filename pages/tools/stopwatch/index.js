var analytics = require('../../../utils/analytics');
// pages/tools/stopwatch/index.js
function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function formatMs(ms) {
  var h = Math.floor(ms / 3600000);
  var m = Math.floor((ms % 3600000) / 60000);
  var s = Math.floor((ms % 60000) / 1000);
  var cs = Math.floor((ms % 1000) / 10);
  if (h > 0) return pad2(h) + ':' + pad2(m) + ':' + pad2(s) + '.' + pad2(cs);
  return pad2(m) + ':' + pad2(s) + '.' + pad2(cs);
}

Page({
  onLoad: function() {
    analytics.trackPage('stopwatch');
    analytics.trackToolUse('stopwatch');
  },
  data: {
    mode: 'stopwatch', // stopwatch / timer
    // 秒表
    swDisplay: '00:00.00',
    swRunning: false,
    swLaps: [],
    swState: 'idle', // idle / running / paused
    // 计时器
    timerDisplay: '00:00',
    timerRunning: false,
    timerState: 'idle',
    timerMinutes: 5,
    timerPresets: [1, 3, 5, 10, 15, 30, 60],
    timerProgress: 100
  },

  _swStart: 0,
  _swElapsed: 0,
  _swTimer: null,
  _tmStart: 0,
  _tmTotal: 0,
  _tmRemaining: 0,
  _tmTimer: null,

  switchMode: function (e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({ mode: mode });
  },

  // ===== 秒表 =====
  swStart: function () {
    var that = this;
    this._swStart = Date.now() - this._swElapsed;
    this._swTimer = setInterval(function () {
      that._swElapsed = Date.now() - that._swStart;
      that.setData({ swDisplay: formatMs(that._swElapsed) });
    }, 30);
    this.setData({ swRunning: true, swState: 'running' });
  },

  swPause: function () {
    clearInterval(this._swTimer);
    this.setData({ swRunning: false, swState: 'paused' });
  },

  swResume: function () { this.swStart(); },

  swLap: function () {
    var laps = this.data.swLaps;
    var prevTotal = 0;
    for (var i = 0; i < laps.length; i++) prevTotal += laps[i].lapMs;
    var lapMs = this._swElapsed - prevTotal;
    laps.push({
      num: laps.length + 1,
      lapTime: formatMs(lapMs),
      totalTime: formatMs(this._swElapsed),
      lapMs: lapMs
    });
    // 标记最快最慢
    if (laps.length >= 3) {
      var min = Infinity, max = 0, minIdx = -1, maxIdx = -1;
      for (var i = 0; i < laps.length; i++) {
        if (laps[i].lapMs < min) { min = laps[i].lapMs; minIdx = i; }
        if (laps[i].lapMs > max) { max = laps[i].lapMs; maxIdx = i; }
      }
      laps = laps.map(function (l, idx) {
        l.isBest = idx === minIdx;
        l.isWorst = idx === maxIdx;
        return l;
      });
    }
    this.setData({ swLaps: laps });
  },

  swReset: function () {
    clearInterval(this._swTimer);
    this._swElapsed = 0;
    this.setData({ swDisplay: '00:00.00', swRunning: false, swState: 'idle', swLaps: [] });
  },

  // ===== 计时器 =====
  setTimerMinutes: function (e) {
    this.setData({ timerMinutes: parseInt(e.currentTarget.dataset.min) });
  },

  timerMinus: function () {
    if (this.data.timerMinutes > 1) this.setData({ timerMinutes: this.data.timerMinutes - 1 });
  },

  timerPlus: function () {
    if (this.data.timerMinutes < 120) this.setData({ timerMinutes: this.data.timerMinutes + 1 });
  },

  tmStart: function () {
    var that = this;
    this._tmTotal = this.data.timerMinutes * 60 * 1000;
    this._tmRemaining = this._tmTotal;
    this._tmStart = Date.now();

    this._tmTimer = setInterval(function () {
      var elapsed = Date.now() - that._tmStart;
      that._tmRemaining = that._tmTotal - elapsed;
      if (that._tmRemaining <= 0) {
        that._tmRemaining = 0;
        clearInterval(that._tmTimer);
        that.setData({ timerDisplay: '00:00', timerRunning: false, timerState: 'done', timerProgress: 0 });
        wx.vibrateLong();
        wx.showModal({ title: '⏰ 时间到！', content: that.data.timerMinutes + '分钟计时已结束', showCancel: false });
        return;
      }
      var progress = (that._tmRemaining / that._tmTotal * 100).toFixed(1);
      var m = Math.floor(that._tmRemaining / 60000);
      var s = Math.floor((that._tmRemaining % 60000) / 1000);
      that.setData({ timerDisplay: pad2(m) + ':' + pad2(s), timerProgress: progress });
    }, 200);
    this.setData({ timerRunning: true, timerState: 'running' });
  },

  tmPause: function () {
    clearInterval(this._tmTimer);
    this._tmTotal = this._tmRemaining;
    this.setData({ timerRunning: false, timerState: 'paused' });
  },

  tmResume: function () {
    var that = this;
    this._tmStart = Date.now();
    this._tmTimer = setInterval(function () {
      var elapsed = Date.now() - that._tmStart;
      that._tmRemaining = that._tmTotal - elapsed;
      if (that._tmRemaining <= 0) {
        that._tmRemaining = 0;
        clearInterval(that._tmTimer);
        that.setData({ timerDisplay: '00:00', timerRunning: false, timerState: 'done', timerProgress: 0 });
        wx.vibrateLong();
        wx.showModal({ title: '⏰ 时间到！', content: '计时已结束', showCancel: false });
        return;
      }
      var progress = (that._tmRemaining / (that.data.timerMinutes * 60 * 1000) * 100).toFixed(1);
      var m = Math.floor(that._tmRemaining / 60000);
      var s = Math.floor((that._tmRemaining % 60000) / 1000);
      that.setData({ timerDisplay: pad2(m) + ':' + pad2(s), timerProgress: progress });
    }, 200);
    this.setData({ timerRunning: true, timerState: 'running' });
  },

  tmReset: function () {
    clearInterval(this._tmTimer);
    this.setData({ timerDisplay: '00:00', timerRunning: false, timerState: 'idle', timerProgress: 100 });
  },

  onUnload: function () {
    clearInterval(this._swTimer);
    clearInterval(this._tmTimer);
  },

  onShareAppMessage: function () {
    analytics.trackShare('friend', 'stopwatch');
    return { title: '秒表计时器', path: '/pages/tools/stopwatch/index' };
  }
});
