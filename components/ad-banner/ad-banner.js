Component({
  properties: {
    type: { type: String, value: 'banner' }
  },
  data: {
    show: true,
    adUnitId: ''
  },
  lifetimes: {
    attached() {
      const app = getApp();
      const ids = app.globalData.adUnitIds || {};
      const id = ids[this.data.type] || '';
      // 只有真实广告ID才设置(非占位ID)
      if (id && !id.includes('xxxxxxxxxx')) {
        this.setData({ adUnitId: id });
      }
    }
  },
  methods: {
    onAdError(e) {
      console.log('广告加载失败', e.detail);
      this.setData({ show: false });
    }
  }
});
