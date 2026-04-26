var analytics = require('./utils/analytics');

App({
  globalData: {
    adUnitIds: {
      banner: 'adunit-xxxxxxxxxx',
      interstitial: 'adunit-xxxxxxxxxx',
      rewardedVideo: 'adunit-xxxxxxxxxx'
    },
    systemInfo: null,
    launchTime: 0,
    userInfo: null
  },

  onLaunch: function(options) {
    this.globalData.launchTime = Date.now();

    // 数据埋点：记录会话
    analytics.trackSession(options ? options.scene : 0);
    analytics.getNewOldRatio(); // 记录新老用户

    // 缓存系统信息
    try {
      this.globalData.systemInfo = wx.getSystemInfoSync();
    } catch (e) {}

    // 恢复登录态
    this._restoreLogin();

    // 清理过期缓存
    this._cleanExpiredCache();
  },

  onShow: function(options) {
    var cost = Date.now() - this.globalData.launchTime;
    if (cost > 0 && cost < 30000) {
      console.log('[性能] 启动耗时: ' + cost + 'ms');
    }
    // 每次回到前台也记录会话
    if (cost > 30000) {
      analytics.trackSession(options ? options.scene : 0);
    }
  },

  // ========== 数据埋点 ==========
  analytics: analytics,

  // ========== 登录管理 ==========

  /**
   * 恢复登录态（从本地存储恢复）
   */
  _restoreLogin: function() {
    try {
      var userInfo = wx.getStorageSync('user_info');
      if (userInfo && userInfo.nickName) {
        this.globalData.userInfo = userInfo;
        // 静默刷新登录 code
        this._silentLogin();
      }
    } catch (e) {}
  },

  /**
   * 静默登录（获取最新 code，不打扰用户）
   */
  _silentLogin: function() {
    wx.login({
      success: function(res) {
        if (res.code) {
          // code 可用于后端换取 openid/session_key
          // 如果有后端服务，在这里发送 code 到服务器
          console.log('[登录] code 已刷新');
        }
      }
    });
  },

  /**
   * 获取用户信息
   * @returns {Object|null}
   */
  getUserInfo: function() {
    return this.globalData.userInfo;
  },

  /**
   * 保存用户信息
   * @param {Object} userInfo - { avatarUrl, nickName, code, ... }
   */
  setUserInfo: function(userInfo) {
    this.globalData.userInfo = userInfo;
    try {
      wx.setStorageSync('user_info', userInfo);
    } catch (e) {}
  },

  /**
   * 清除用户信息（退出登录）
   */
  clearUserInfo: function() {
    this.globalData.userInfo = null;
    try {
      wx.removeStorageSync('user_info');
    } catch (e) {}
  },

  /**
   * 检查是否已登录
   * @returns {boolean}
   */
  isLoggedIn: function() {
    return !!this.globalData.userInfo;
  },

  /**
   * 记录工具使用次数
   */
  trackToolUsage: function() {
    try {
      var count = wx.getStorageSync('tool_usage_count') || 0;
      wx.setStorageSync('tool_usage_count', count + 1);
    } catch (e) {}
  },

  // ========== 缓存管理 ==========

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

  getCache: function(key) {
    try {
      var item = wx.getStorageSync('cache_' + key);
      if (item && item.expire > Date.now()) {
        return item.data;
      }
      if (item) {
        wx.removeStorageSync('cache_' + key);
      }
    } catch (e) {}
    return null;
  },

  removeCache: function(key) {
    try {
      wx.removeStorageSync('cache_' + key);
    } catch (e) {}
  },

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
