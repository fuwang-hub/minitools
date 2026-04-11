App({
  globalData: {
    adUnitIds: {
      banner: 'adunit-xxxxxxxxxx',
      interstitial: 'adunit-xxxxxxxxxx',
      rewardedVideo: 'adunit-xxxxxxxxxx'
    },
    systemInfo: null,
    launchTime: 0
  },

  onLaunch: function() {
    this.globalData.launchTime = Date.now();

    // 缓存系统信息（避免每个页面重复调用）
    try {
      this.globalData.systemInfo = wx.getSystemInfoSync();
    } catch (e) {}

    // 清理过期缓存（超过7天的）
    this._cleanExpiredCache();
  },

  onShow: function() {
    // 记录启动耗时
    var cost = Date.now() - this.globalData.launchTime;
    if (cost > 0 && cost < 30000) {
      console.log('[性能] 启动耗时: ' + cost + 'ms');
    }
  },

  // ========== 缓存管理 ==========

  /**
   * 带过期时间的缓存写入
   * @param {string} key - 缓存键
   * @param {any} data - 数据
   * @param {number} expireMs - 过期时间（毫秒），默认 24 小时
   */
  setCache: function(key, data, expireMs) {
    expireMs = expireMs || 86400000;
    try {
      wx.setStorageSync('cache_' + key, {
        data: data,
        expire: Date.now() + expireMs,
        version: 1
      });
    } catch (e) {
      console.warn('[缓存] 写入失败:', key);
    }
  },

  /**
   * 读取缓存（自动检查过期）
   * @param {string} key - 缓存键
   * @returns {any|null} 缓存数据或 null
   */
  getCache: function(key) {
    try {
      var item = wx.getStorageSync('cache_' + key);
      if (item && item.expire > Date.now()) {
        return item.data;
      }
      // 过期则删除
      if (item) {
        wx.removeStorageSync('cache_' + key);
      }
    } catch (e) {}
    return null;
  },

  /**
   * 清除指定缓存
   */
  removeCache: function(key) {
    try {
      wx.removeStorageSync('cache_' + key);
    } catch (e) {}
  },

  /**
   * 清理所有过期缓存
   */
  _cleanExpiredCache: function() {
    try {
      var info = wx.getStorageInfoSync();
      var keys = info.keys || [];
      var now = Date.now();
      keys.forEach(function(key) {
        if (key.indexOf('cache_') === 0) {
          try {
            var item = wx.getStorageSync(key);
            if (item && item.expire && item.expire < now) {
              wx.removeStorageSync(key);
            }
          } catch (e) {}
        }
      });
    } catch (e) {}
  },

  // ========== 广告管理 ==========

  /**
   * 创建插屏广告实例（全局复用）
   */
  _interstitialAd: null,
  getInterstitialAd: function() {
    if (!this._interstitialAd && wx.createInterstitialAd) {
      var id = this.globalData.adUnitIds.interstitial;
      if (id && id.indexOf('xxxxxxxxxx') < 0) {
        this._interstitialAd = wx.createInterstitialAd({ adUnitId: id });
        this._interstitialAd.onError(function() {});
      }
    }
    return this._interstitialAd;
  },

  /**
   * 创建激励视频实例（全局复用）
   */
  _rewardedAd: null,
  getRewardedAd: function() {
    if (!this._rewardedAd && wx.createRewardedVideoAd) {
      var id = this.globalData.adUnitIds.rewardedVideo;
      if (id && id.indexOf('xxxxxxxxxx') < 0) {
        this._rewardedAd = wx.createRewardedVideoAd({ adUnitId: id });
        this._rewardedAd.onError(function() {});
      }
    }
    return this._rewardedAd;
  }
});
