var analytics = require('../../../utils/analytics');
// pages/tools/ledger/index.js
var CATEGORIES = {
  expense: [
    { key: 'food', emoji: '🍜', name: '餐饮' },
    { key: 'transport', emoji: '🚗', name: '交通' },
    { key: 'shopping', emoji: '🛍️', name: '购物' },
    { key: 'entertainment', emoji: '🎮', name: '娱乐' },
    { key: 'housing', emoji: '🏠', name: '住房' },
    { key: 'medical', emoji: '💊', name: '医疗' },
    { key: 'education', emoji: '📚', name: '教育' },
    { key: 'gift', emoji: '🎁', name: '礼物' },
    { key: 'clothes', emoji: '👕', name: '服饰' },
    { key: 'communication', emoji: '📱', name: '通讯' },
    { key: 'daily', emoji: '🧴', name: '日用' },
    { key: 'other_exp', emoji: '📝', name: '其他' }
  ],
  income: [
    { key: 'salary', emoji: '💰', name: '工资' },
    { key: 'bonus', emoji: '🎊', name: '奖金' },
    { key: 'invest', emoji: '📈', name: '理财' },
    { key: 'redpacket', emoji: '🧧', name: '红包' },
    { key: 'refund', emoji: '💳', name: '退款' },
    { key: 'other_inc', emoji: '📝', name: '其他' }
  ]
};

function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function getToday() { var d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function getMonthKey(dateStr) { return dateStr.substring(0, 7); }

Page({
  data: {
    // 当前视图
    tab: 'record', // record / stats
    recordType: 'expense',
    categories: CATEGORIES.expense,
    selectedCat: 'food',
    amount: '',
    remark: '',
    date: getToday(),
    // 列表
    records: [],
    monthKey: getMonthKey(getToday()),
    monthExpense: '0.00',
    monthIncome: '0.00',
    monthBalance: '0.00',
    groupedRecords: [],
    // 统计
    statCategories: [],
    statTotal: '0.00'
  },

  onLoad: function () {
    analytics.trackPage('ledger');
    analytics.startStay('ledger');
    analytics.trackToolUse('ledger');
    this.loadRecords();
  },

  onShow: function () {
    this.loadRecords();
  },

  // Tab切换
  switchTab: function (e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ tab: tab });
    if (tab === 'stats') this.calcStats();
  },

  switchRecordType: function (e) {
    var type = e.currentTarget.dataset.type;
    var cats = type === 'expense' ? CATEGORIES.expense : CATEGORIES.income;
    this.setData({ recordType: type, categories: cats, selectedCat: cats[0].key });
  },

  selectCat: function (e) {
    this.setData({ selectedCat: e.currentTarget.dataset.key });
  },

  onAmountInput: function (e) { this.setData({ amount: e.detail.value }); },
  onRemarkInput: function (e) { this.setData({ remark: e.detail.value }); },
  onDateChange: function (e) { this.setData({ date: e.detail.value }); },

  // 保存记录
  saveRecord: function () {
    var amount = parseFloat(this.data.amount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: '请输入金额', icon: 'none' }); return;
    }
    var cat = null;
    var cats = this.data.categories;
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].key === this.data.selectedCat) { cat = cats[i]; break; }
    }

    var record = {
      id: Date.now(),
      type: this.data.recordType,
      category: cat.key,
      categoryName: cat.name,
      categoryEmoji: cat.emoji,
      amount: amount.toFixed(2),
      remark: this.data.remark,
      date: this.data.date,
      time: new Date().getHours() + ':' + pad2(new Date().getMinutes())
    };

    var records = wx.getStorageSync('ledger_records') || [];
    records.unshift(record);
    wx.setStorageSync('ledger_records', records);

    wx.showToast({ title: '记录成功', icon: 'success' });
    this.setData({ amount: '', remark: '' });
    this.loadRecords();
  },

  // 加载记录
  loadRecords: function () {
    var records = wx.getStorageSync('ledger_records') || [];
    var mk = this.data.monthKey;
    var monthRecords = records.filter(function (r) { return getMonthKey(r.date) === mk; });

    var expense = 0, income = 0;
    monthRecords.forEach(function (r) {
      if (r.type === 'expense') expense += parseFloat(r.amount);
      else income += parseFloat(r.amount);
    });

    // 按日期分组
    var groups = {};
    monthRecords.forEach(function (r) {
      if (!groups[r.date]) groups[r.date] = { date: r.date, items: [], dayExp: 0, dayInc: 0 };
      groups[r.date].items.push(r);
      if (r.type === 'expense') groups[r.date].dayExp += parseFloat(r.amount);
      else groups[r.date].dayInc += parseFloat(r.amount);
    });
    var sorted = Object.keys(groups).sort(function (a, b) { return b.localeCompare(a); });
    var grouped = sorted.map(function (k) {
      return {
        date: k,
        dateLabel: k.substring(5),
        items: groups[k].items,
        dayExp: groups[k].dayExp.toFixed(2),
        dayInc: groups[k].dayInc.toFixed(2)
      };
    });

    this.setData({
      records: records,
      monthExpense: expense.toFixed(2),
      monthIncome: income.toFixed(2),
      monthBalance: (income - expense).toFixed(2),
      groupedRecords: grouped
    });
  },

  // 月份切换
  prevMonth: function () {
    var parts = this.data.monthKey.split('-');
    var y = parseInt(parts[0]), m = parseInt(parts[1]) - 1;
    if (m < 1) { m = 12; y--; }
    this.setData({ monthKey: y + '-' + pad2(m) });
    this.loadRecords();
  },
  nextMonth: function () {
    var parts = this.data.monthKey.split('-');
    var y = parseInt(parts[0]), m = parseInt(parts[1]) + 1;
    if (m > 12) { m = 1; y++; }
    this.setData({ monthKey: y + '-' + pad2(m) });
    this.loadRecords();
  },

  // 删除记录
  deleteRecord: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: function (res) {
        if (res.confirm) {
          var records = wx.getStorageSync('ledger_records') || [];
          records = records.filter(function (r) { return r.id !== id; });
          wx.setStorageSync('ledger_records', records);
          that.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 统计
  calcStats: function () {
    var records = wx.getStorageSync('ledger_records') || [];
    var mk = this.data.monthKey;
    var monthRecords = records.filter(function (r) { return getMonthKey(r.date) === mk && r.type === 'expense'; });

    var catMap = {};
    var total = 0;
    monthRecords.forEach(function (r) {
      var key = r.category;
      if (!catMap[key]) catMap[key] = { key: key, name: r.categoryName, emoji: r.categoryEmoji, amount: 0 };
      catMap[key].amount += parseFloat(r.amount);
      total += parseFloat(r.amount);
    });

    var list = Object.values(catMap).sort(function (a, b) { return b.amount - a.amount; });
    list = list.map(function (c) {
      return {
        key: c.key, name: c.name, emoji: c.emoji,
        amount: c.amount.toFixed(2),
        percent: total > 0 ? (c.amount / total * 100).toFixed(1) : '0',
        barWidth: total > 0 ? (c.amount / total * 100).toFixed(1) : '0'
      };
    });

    this.setData({ statCategories: list, statTotal: total.toFixed(2) });
  },

  onHide: function() { analytics.endStay('ledger'); },


  onUnload: function() { analytics.endStay('ledger'); },



  onShareAppMessage: function () {
    analytics.trackShare('friend', 'ledger');
    return { title: '记账本 - 轻松管理每一笔', path: '/pages/tools/ledger/index' };
  }
});
