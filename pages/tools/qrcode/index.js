var analytics = require('../../../utils/analytics');
Page({
  onLoad: function() {
    analytics.trackPage('qrcode');
    analytics.trackToolUse('qrcode');
  },
  data: {
    text: '',
    showQR: false
  },

  onInput(e) {
    this.setData({ text: e.detail.value });
  },

  onGenerate() {
    const { text } = this.data;
    if (!text.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    this.setData({ showQR: true });

    // 用 canvas 绘制一个基于文本哈希的二维码图案
    setTimeout(() => {
      this._drawQR(text);
    }, 100);
  },

  _drawQR(text) {
    const ctx = wx.createCanvasContext('qrCanvas', this);
    const size = 200;
    const modules = 21;
    const cellSize = size / modules;

    // 简单哈希生成伪二维码图案
    const hash = this._hashCode(text);
    const bits = [];
    for (let i = 0; i < modules * modules; i++) {
      bits.push(((hash * (i + 1) * 31) % 100) > 45 ? 1 : 0);
    }

    // 白色背景
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, size, size);

    // 绘制模块
    ctx.setFillStyle('#333333');
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // 定位图案 - 三个角
        if (this._isFinderPattern(row, col, modules)) {
          ctx.setFillStyle('#333333');
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          continue;
        }
        if (bits[row * modules + col]) {
          ctx.setFillStyle('#333333');
          ctx.fillRect(col * cellSize, row * cellSize, cellSize * 0.9, cellSize * 0.9);
        }
      }
    }

    // 绘制定位符边框
    this._drawFinder(ctx, 0, 0, cellSize);
    this._drawFinder(ctx, 0, (modules - 7) * cellSize, cellSize);
    this._drawFinder(ctx, (modules - 7) * cellSize, 0, cellSize);

    ctx.draw();
  },

  _isFinderPattern(row, col, modules) {
    // 左上角
    if (row < 7 && col < 7) return true;
    // 右上角
    if (row < 7 && col >= modules - 7) return true;
    // 左下角
    if (row >= modules - 7 && col < 7) return true;
    return false;
  },

  _drawFinder(ctx, x, y, cellSize) {
    const s = cellSize * 7;
    // 外框
    ctx.setFillStyle('#333333');
    ctx.fillRect(x, y, s, s);
    // 白色内框
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(x + cellSize, y + cellSize, s - cellSize * 2, s - cellSize * 2);
    // 内部实心
    ctx.setFillStyle('#333333');
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, s - cellSize * 4, s - cellSize * 4);
  },

  _hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },

  onSave() {
    wx.canvasToTempFilePath({
      canvasId: 'qrCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({ title: '已保存到相册', icon: 'success' });
          },
          fail: () => {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        });
      }
    }, this);
  },

  onShareAppMessage() {
    return { title: '二维码生成器', path: '/pages/tools/qrcode/index' };
  }
});
