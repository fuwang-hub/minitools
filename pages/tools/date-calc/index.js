var analytics = require('../../../utils/analytics');
var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function today() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function diffDays(d1, d2) {
  var t1 = new Date(d1.replace(/-/g, '/')).getTime();
  var t2 = new Date(d2.replace(/-/g, '/')).getTime();
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

function addDaysToDate(dateStr, days) {
  var d = new Date(dateStr.replace(/-/g, '/'));
  d.setDate(d.getDate() + days);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return { date: y + '-' + m + '-' + dd, weekday: weekdays[d.getDay()] };
}

Page({
  data: {
    mode: 'diff',
    // diff
    startDate: today(),
    endDate: today(),
    diffResult: null,
    diffWeeks: 0,
    diffRemainDays: 0,
    // add
    baseDate: today(),
    addDays: 30,
    addResult: '',
    addWeekday: '',
    // countdown
    targetDate: today(),
    eventName: '',
    countdownDays: null,
    absCountdownDays: 0
  },

  onLoad: function() {
    this._calcDiff();
    this._calcAdd();
    this._calcCountdown();
  },

  switchMode: function(e) {
    this.setData({ mode: e.currentTarget.dataset.mode });
  },

  // === 日期差 ===
  onStartDateChange: function(e) {
    this.setData({ startDate: e.detail.value });
    this._calcDiff();
  },
  onEndDateChange: function(e) {
    this.setData({ endDate: e.detail.value });
    this._calcDiff();
  },
  _calcDiff: function() {
    var d = diffDays(this.data.startDate, this.data.endDate);
    var abs = Math.abs(d);
    this.setData({
      diffResult: abs,
      diffWeeks: Math.floor(abs / 7),
      diffRemainDays: abs % 7
    });
  },

  // === 推算 ===
  onBaseDateChange: function(e) {
    this.setData({ baseDate: e.detail.value });
    this._calcAdd();
  },
  onAddDaysChange: function(e) {
    this.setData({ addDays: Number(e.detail.value) || 0 });
    this._calcAdd();
  },
  _calcAdd: function() {
    var { baseDate, addDays: days } = this.data;
    var r = addDaysToDate(baseDate, days);
    this.setData({ addResult: r.date, addWeekday: r.weekday });
  },

  // === 倒计时 ===
  onTargetDateChange: function(e) {
    this.setData({ targetDate: e.detail.value });
    this._calcCountdown();
  },
  onEventNameChange: function(e) {
    this.setData({ eventName: e.detail.value });
  },
  _calcCountdown: function() {
    var d = diffDays(today(), this.data.targetDate);
    this.setData({ countdownDays: d, absCountdownDays: Math.abs(d) });
  }
});
