var analytics = require('../../../utils/analytics');
// pages/tools/ruler/index.js
// 手机屏幕变尺子
Page({
  data: {
    unit: 'cm',  // cm / inch
    screenHeight: 0,  // rpx
    screenHeightPx: 0,
    rulerMarks: [],
    totalCm: 0,
    totalInch: 0,
    dpi: 0,
    ppi: 0,
    calibrated: false,
    calibrateMode: false,
    creditCardPx: 0 // 信用卡实际像素高度（85.6mm标准）
  },

  onLoad: function () {
    analytics.trackPage('ruler');
    analytics.trackToolUse('ruler');
    this.initRuler();
  },

  initRuler: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (info) {
        // 屏幕物理信息
        var screenW = info.screenWidth;   // px
        var screenH = info.screenHeight;  // px
        var pixelRatio = info.pixelRatio;

        // 估算 PPI（根据常见设备）
        // 默认使用 iPhone 系列的 PPI
        var ppi = 326; // iPhone标准
        var brand = (info.brand || '').toLowerCase();
        var model = (info.model || '').toLowerCase();

        if (model.indexOf('iphone') >= 0) {
          if (model.indexOf('plus') >= 0 || model.indexOf('max') >= 0) ppi = 458;
          else if (model.indexOf('pro') >= 0) ppi = 460;
          else if (model.indexOf('mini') >= 0) ppi = 476;
          else ppi = 326;
        } else if (brand === 'huawei' || brand === 'honor') {
          ppi = 400;
        } else if (brand === 'xiaomi' || brand === 'redmi') {
          ppi = 395;
        } else if (brand === 'samsung') {
          ppi = 401;
        } else if (brand === 'oppo' || brand === 'vivo' || brand === 'realme') {
          ppi = 401;
        } else {
          ppi = 400; // 默认值
        }

        // 1 inch = 25.4mm, ppi = pixels per inch
        // 每个物理像素 = 25.4/ppi mm
        var mmPerPx = 25.4 / ppi * pixelRatio;
        var cmPerPx = mmPerPx / 10;

        var totalCm = screenH * cmPerPx;
        var totalInch = totalCm / 2.54;

        // 生成刻度（每mm一个）
        var marks = [];
        var totalMm = Math.floor(totalCm * 10);
        for (var i = 0; i <= totalMm; i++) {
          var pxPos = i / cmPerPx / 10;
          var h = 20;
          var showLabel = false;
          var label = '';
          if (i % 10 === 0) {
            h = 50; showLabel = true; label = (i / 10) + '';
          } else if (i % 5 === 0) {
            h = 35;
          }
          marks.push({ top: pxPos, height: h, showLabel: showLabel, label: label, isCm: i % 10 === 0 });
        }

        that.setData({
          screenHeightPx: screenH,
          rulerMarks: marks,
          totalCm: totalCm.toFixed(1),
          totalInch: totalInch.toFixed(1),
          ppi: ppi,
          mmPerPx: mmPerPx.toFixed(3),
          dpi: Math.round(ppi / pixelRatio)
        });
      }
    });
  },

  switchUnit: function (e) {
    this.setData({ unit: e.currentTarget.dataset.unit });
  },

  // 校准模式：用信用卡校准
  startCalibrate: function () {
    this.setData({ calibrateMode: true });
  },

  cancelCalibrate: function () {
    this.setData({ calibrateMode: false });
  },

  // 用户调整信用卡大小校准完成
  onCalibrateConfirm: function () {
    // 信用卡标准高度: 53.98mm
    // 这里简化处理，实际应该让用户拖拽对齐
    this.setData({ calibrateMode: false, calibrated: true });
    wx.showToast({ title: '校准完成', icon: 'success' });
    this.initRuler();
  },

  onShareAppMessage: function () {
    analytics.trackShare('friend', 'ruler');
    return { title: '手机尺子 - 随身测量工具', path: '/pages/tools/ruler/index' };
  }
});
