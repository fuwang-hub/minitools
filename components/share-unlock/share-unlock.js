// components/share-unlock/share-unlock.js
var shareUtil = require('../../utils/share');

Component({
  properties: {
    pageKey: { type: String, value: '' },  // 页面标识
    title: { type: String, value: '完整报告' },  // 解锁的内容名称
    brief: { type: String, value: '' }  // 简要预览
  },

  data: {
    unlocked: false
  },

  lifetimes: {
    attached: function() {
      this._checkUnlock();
    }
  },

  methods: {
    _checkUnlock: function() {
      var unlocked = shareUtil.isUnlocked(this.properties.pageKey);
      this.setData({ unlocked: unlocked });
      if (unlocked) {
        this.triggerEvent('unlocked');
      }
    },

    onShareSuccess: function() {
      // 分享成功后解锁
      shareUtil.unlock(this.properties.pageKey);
      shareUtil.recordShare(this.properties.pageKey, 'unlock');
      this.setData({ unlocked: true });
      this.triggerEvent('unlocked');
      wx.showToast({ title: '已解锁', icon: 'success' });
    },

    // 通过广告解锁（备选）
    onAdUnlock: function() {
      shareUtil.unlock(this.properties.pageKey);
      this.setData({ unlocked: true });
      this.triggerEvent('unlocked');
      wx.showToast({ title: '已解锁', icon: 'success' });
    }
  }
});
