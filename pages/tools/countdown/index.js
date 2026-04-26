var analytics = require('../../../utils/analytics');
// pages/tools/countdown/index.js
function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function getToday() { var d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function diffDays(d1, d2) {
  var t1 = new Date(d1.replace(/-/g, '/')).getTime();
  var t2 = new Date(d2.replace(/-/g, '/')).getTime();
  return Math.round((t2 - t1) / 86400000);
}

var COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
var EMOJIS = ['🎂', '❤️', '🎓', '✈️', '🎯', '💍', '🏠', '🎊', '⭐', '🌸'];

Page({
  data: {
    events: [],
    showAdd: false,
    editId: 0,
    newName: '',
    newDate: getToday(),
    newEmoji: '🎯',
    newIsCountdown: true, // true=倒数日(未来) false=纪念日(过去)
    emojis: EMOJIS,
    today: getToday()
  },

  onLoad: function () {
    analytics.trackPage('countdown');
    analytics.trackToolUse('countdown'); this.loadEvents(); },
  onShow: function () { this.loadEvents(); },

  loadEvents: function () {
    var events = wx.getStorageSync('countdown_events') || [];
    var today = getToday();
    events = events.map(function (e, idx) {
      var diff = diffDays(today, e.date);
      var absDiff = Math.abs(diff);
      return {
        id: e.id, name: e.name, date: e.date, emoji: e.emoji, isCountdown: e.isCountdown,
        color: COLORS[idx % COLORS.length],
        days: absDiff,
        isPast: diff < 0,
        isFuture: diff > 0,
        isToday: diff === 0,
        label: diff === 0 ? '就是今天！' : (e.isCountdown ? (diff > 0 ? '还有' : '已过') : '已经'),
        unit: diff === 0 ? '' : '天'
      };
    });
    // 排序：倒数日按剩余天数升序，纪念日按已过天数升序
    events.sort(function (a, b) {
      if (a.isToday) return -1;
      if (b.isToday) return 1;
      if (a.isCountdown && !a.isPast && b.isCountdown && !b.isPast) return a.days - b.days;
      return a.days - b.days;
    });
    this.setData({ events: events, today: today });
  },

  showAddForm: function () {
    this.setData({ showAdd: true, editId: 0, newName: '', newDate: getToday(), newEmoji: '🎯', newIsCountdown: true });
  },

  hideAddForm: function () { this.setData({ showAdd: false }); },

  onNameInput: function (e) { this.setData({ newName: e.detail.value }); },
  onDateChange: function (e) { this.setData({ newDate: e.detail.value }); },
  selectEmoji: function (e) { this.setData({ newEmoji: e.currentTarget.dataset.emoji }); },
  switchType: function (e) { this.setData({ newIsCountdown: e.currentTarget.dataset.type === 'countdown' }); },

  saveEvent: function () {
    var name = this.data.newName.trim();
    if (!name) { wx.showToast({ title: '请输入事件名称', icon: 'none' }); return; }
    var events = wx.getStorageSync('countdown_events') || [];
    if (this.data.editId) {
      events = events.map(function (e) {
        if (e.id === this.data.editId) {
          return { id: e.id, name: name, date: this.data.newDate, emoji: this.data.newEmoji, isCountdown: this.data.newIsCountdown };
        }
        return e;
      }.bind(this));
    } else {
      events.push({ id: Date.now(), name: name, date: this.data.newDate, emoji: this.data.newEmoji, isCountdown: this.data.newIsCountdown });
    }
    wx.setStorageSync('countdown_events', events);
    this.setData({ showAdd: false });
    this.loadEvents();
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  editEvent: function (e) {
    var id = e.currentTarget.dataset.id;
    var events = wx.getStorageSync('countdown_events') || [];
    var ev = null;
    for (var i = 0; i < events.length; i++) {
      if (events[i].id === id) { ev = events[i]; break; }
    }
    if (ev) {
      this.setData({ showAdd: true, editId: id, newName: ev.name, newDate: ev.date, newEmoji: ev.emoji, newIsCountdown: ev.isCountdown });
    }
  },

  deleteEvent: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '确认删除', content: '确定要删除这个事件吗？',
      success: function (res) {
        if (res.confirm) {
          var events = wx.getStorageSync('countdown_events') || [];
          events = events.filter(function (ev) { return ev.id !== id; });
          wx.setStorageSync('countdown_events', events);
          that.loadEvents();
        }
      }
    });
  },

  onShareAppMessage: function () {
    analytics.trackShare('friend', 'countdown');
    return { title: '倒数日 - 记录每一个重要时刻', path: '/pages/tools/countdown/index' };
  }
});
