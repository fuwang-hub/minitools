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

  onLoad() {
    this.onGenerate();
  },

  toggleOption(e) {
    const key = e.currentTarget.dataset.key;
    const newVal = !this.data[key];
    // 至少保留一个选项
    const { uppercase, lowercase, numbers, symbols } = this.data;
    const counts = [uppercase, lowercase, numbers, symbols].filter(Boolean).length;
    if (counts <= 1 && !newVal) {
      wx.showToast({ title: '至少保留一个选项', icon: 'none' });
      return;
    }
    this.setData({ [key]: newVal });
  },

  onLengthChange(e) {
    this.setData({ length: e.detail.value });
  },

  onGenerate() {
    const { length, uppercase, lowercase, numbers, symbols } = this.data;
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      wx.showToast({ title: '请至少选择一种字符', icon: 'none' });
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // 计算强度
    const strength = this._calcStrength(password);

    this.setData({
      password,
      history: [password, ...this.data.history].slice(0, 20),
      ...strength
    });
  },

  _calcStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (pw.length >= 16) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    const levels = [
      { min: 0, percent: 15, color: '#ef4444', label: '极弱' },
      { min: 2, percent: 30, color: '#f97316', label: '弱' },
      { min: 3, percent: 50, color: '#eab308', label: '一般' },
      { min: 5, percent: 75, color: '#22c55e', label: '强' },
      { min: 6, percent: 100, color: '#667eea', label: '极强' }
    ];

    let result = levels[0];
    for (const l of levels) {
      if (score >= l.min) result = l;
    }

    return {
      strengthPercent: result.percent,
      strengthColor: result.color,
      strengthLabel: result.label
    };
  },

  onCopy() {
    if (!this.data.password) return;
    wx.setClipboardData({
      data: this.data.password,
      success: () => wx.showToast({ title: '已复制', icon: 'success' })
    });
  },

  onCopyHistory(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.pw,
      success: () => wx.showToast({ title: '已复制', icon: 'success' })
    });
  },

  onClear() {
    this.setData({ history: [] });
  },

  onShareAppMessage() {
    return { title: '密码生成器 - 生成安全密码', path: '/pages/tools/password/index' };
  }
});
