Page({
  data: {
    min: 1,
    max: 100,
    count: 1,
    result: null,
    results: [],
    history: []
  },

  onMinChange(e) { this.setData({ min: Number(e.detail.value) || 0 }); },
  onMaxChange(e) { this.setData({ max: Number(e.detail.value) || 100 }); },
  onCountChange(e) {
    let c = Number(e.detail.value) || 1;
    if (c > 100) c = 100;
    if (c < 1) c = 1;
    this.setData({ count: c });
  },

  onGenerate() {
    const { min, max, count } = this.data;
    if (min > max) {
      wx.showToast({ title: '最小值不能大于最大值', icon: 'none' });
      return;
    }

    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    const historyEntry = count === 1
      ? String(results[0])
      : '[' + results.join(', ') + ']';

    this.setData({
      result: results[0],
      results,
      history: [historyEntry, ...this.data.history].slice(0, 50)
    });

    wx.vibrateShort({ type: 'light' });
  },

  onClear() {
    this.setData({ history: [], result: null, results: [] });
  },

  onShareAppMessage() {
    return { title: '随机数生成器', path: '/pages/tools/random/index' };
  }
});
