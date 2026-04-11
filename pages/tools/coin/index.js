Page({
  data: {
    result: null,
    flipping: false,
    history: [],
    headCount: 0,
    tailCount: 0,
    headRate: '0'
  },

  onFlip() {
    if (this.data.flipping) return;
    this.setData({ flipping: true });

    setTimeout(() => {
      const result = Math.random() < 0.5 ? 0 : 1;
      const history = [result, ...this.data.history];
      const headCount = history.filter(v => v === 0).length;
      const tailCount = history.length - headCount;
      const headRate = (headCount / history.length * 100).toFixed(1);

      this.setData({
        result,
        flipping: false,
        history,
        headCount,
        tailCount,
        headRate
      });

      wx.vibrateShort({ type: 'medium' });
    }, 700);
  },

  onClear() {
    this.setData({
      result: null,
      history: [],
      headCount: 0,
      tailCount: 0,
      headRate: '0'
    });
  },

  onShareAppMessage() {
    return { title: '抛硬币 - 让命运帮你做决定', path: '/pages/tools/coin/index' };
  }
});
