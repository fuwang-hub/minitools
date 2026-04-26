var analytics = require('../../../utils/analytics');
Page({
  data: {
    password: '',
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    history: [],
    strengthPercent: 0,
    strengthColor: '#ddd',
    strengthLabel: ''
  },

  onLoad: function() {
    this.onGenerate();
  },

  toggleOption: function(e) {
    var key = e.currentTarget.dataset.key;
    var newVal = !this.data[key];
    // 至少保留一个选项
    var { uppercase, lowercase, numbers, symbols } = this.data;
    var counts = [uppercase, lowercase, numbers, symbols].filter(Boolean).length;
    if (counts <= 1 && !newVal) {
      wx.showToast({ title: '至少保留一个选项', icon: 'none' });
      return;
    }
    this.setData({ [key]: newVal });
  },

  onLengthChange: function(e) {
    this.setData({ length: e.detail.value });
  },

  onGenerate: function() {
    var { length, uppercase, lowercase, numbers, symbols } = this.data;
    var chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      wx.showToast({ title: '请至少选择一种字符', icon: 'none' });
      return;
    }

    var password = '';
    for (var i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // 计算强度
    var strength = this._calcStrength(password);

    this.setData({
      password: password,
      history: [password].concat(this.data.history).slice(0, 20),
      strengthLevel: strength.strengthLevel,
      strengthPercent: strength.strengthPercent,
      strengthColor: strength.strengthColor,
      strengthText: strength.strengthText
    });
  },

  _calcStrength: function(pw) {
    var score = 0;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (pw.length >= 16) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    var levels = [
      { min: 0, percent: 15, color: '#ef4444', label: '极弱' },
      { min: 2, percent: 30, color: '#f97316', label: '弱' },
      { min: 3, percent: 50, color: '#eab308', label: '一般' },
      { min: 5, percent: 75, color: '#22c55e', label: '强' },
      { min: 6, percent: 100, color: '#667eea', label: '极强' }
    ];

    var result = levels[0];
    for (var l of levels) {
      if (score >= l.min) result = l;
    }

    return {
      strengthPercent: result.percent,
      strengthColor: result.color,
      strengthLabel: result.label
    };
  },

  onCopy: function() {
    if (!this.data.password) return;
    wx.setClipboardData({
      data: this.data.password,
      success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  onCopyHistory: function(e) {
    wx.setClipboardDatafunction({
      data: e.currentTarget.dataset.pw,
      success: function() { wx.showToast({ title: '已复制', icon: 'success' }); }
    });
  },

  onClear: function() {
    this.setData({ history: [] });
  },

  onShareAppMessage: function() {
    return { title: '密码生成器 - 生成安全密码', path: '/pages/tools/password/index' };
  }
});
