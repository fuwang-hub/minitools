var analytics = require('../../utils/analytics');

Page({
  data: {
    overview: {},
    toolRanking: [],
    pageRanking: [],
    shareStats: {},
    adStats: {},
    retention: {},
    todayStats: {},
    eventLog: [],
    showEvents: false,
    showExport: false,
    exportData: ''
  },

  onLoad: function() {
    this.loadData();
  },

  onPullDownRefresh: function() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData: function() {
    var overview = analytics.getOverview();
    var toolRanking = analytics.getToolRanking().slice(0, 15);
    var pageRanking = analytics.getPageRanking().slice(0, 15);
    var shareStats = analytics.getShareStats();
    var adStats = analytics.getAdStats();
    var retention = analytics.getRetention();
    var todayStats = analytics.getTodayStats();
    var eventLog = analytics.getEventLog(30);

    // 计算额外统计
    overview.avgPVPerSession = overview.totalSessions > 0
      ? (overview.totalPV / overview.totalSessions).toFixed(1) : '0';
    overview.shareRate = overview.totalSessions > 0
      ? (overview.totalShares / overview.totalSessions * 100).toFixed(1) : '0';

    this.setData({
      overview: overview,
      toolRanking: toolRanking,
      pageRanking: pageRanking,
      shareStats: shareStats,
      adStats: adStats,
      retention: retention,
      todayStats: todayStats,
      eventLog: eventLog.reverse()
    });
  },

  toggleEvents: function() {
    this.setData({ showEvents: !this.data.showEvents });
  },

  exportAllData: function() {
    var data = analytics.exportData();
    var json = JSON.stringify(data, null, 2);
    this.setData({ showExport: true, exportData: json });
  },

  closeExport: function() {
    this.setData({ showExport: false });
  },

  copyExport: function() {
    wx.setClipboardData({
      data: this.data.exportData,
      success: function() {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  reportServer: function() {
    analytics.reportToServer();
    wx.showToast({ title: '已触发上报', icon: 'success' });
  },

  clearData: function() {
    var that = this;
    wx.showModal({
      title: '确认清除',
      content: '清除所有埋点数据？此操作不可恢复。',
      success: function(res) {
        if (res.confirm) {
          analytics.clearAll();
          that.loadData();
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  onShareAppMessage: function() {
    return {
      title: '万能工具箱 - 数据看板',
      path: '/pages/admin/index'
    };
  }
});
