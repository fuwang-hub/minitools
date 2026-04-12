// pages/profile/index.js
var app = getApp();

Page({
  data: {
    isLogin: false,
    userInfo: null,
    toolUsageCount: 0,
    favoriteCount: 0,
    menuList: [
      { id: 'favorites', icon: '⭐', title: '我的收藏', desc: '收藏的工具' },
      { id: 'history', icon: '📋', title: '使用记录', desc: '最近使用的工具' },
      { id: 'feedback', icon: '💬', title: '意见反馈', desc: '帮助我们改进' },
      { id: 'share', icon: '🔗', title: '分享给好友', desc: '好东西要分享', isShare: true },
      { id: 'about', icon: 'ℹ️', title: '关于我们', desc: '万能工具箱 v1.0.0' }
    ]
  },

  onLoad: function () {
    this.checkLoginStatus();
    this.loadStats();
  },

  onShow: function () {
    this.checkLoginStatus();
    this.loadStats();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    var userInfo = app.getUserInfo();
    this.setData({
      isLogin: !!userInfo,
      userInfo: userInfo
    });
  },

  // 加载统计数据
  loadStats: function () {
    try {
      // 使用次数
      var count = wx.getStorageSync('tool_usage_count') || 0;
      // 收藏数
      var favs = wx.getStorageSync('favorites') || [];
      this.setData({
        toolUsageCount: count,
        favoriteCount: favs.length
      });
    } catch (e) {}
  },

  // 微信登录
  onLogin: function () {
    var that = this;
    // 先获取用户头像昵称
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: function (res) {
        var userInfo = res.userInfo;
        // 调用 wx.login 获取 code
        wx.login({
          success: function (loginRes) {
            if (loginRes.code) {
              userInfo.code = loginRes.code;
            }
            // 保存用户信息
            app.setUserInfo(userInfo);
            that.setData({
              isLogin: true,
              userInfo: userInfo
            });
            wx.showToast({ title: '登录成功', icon: 'success' });
          }
        });
      },
      fail: function () {
        // getUserProfile 被拒绝或不支持，使用头像昵称填写能力
        that.showAvatarLogin();
      }
    });
  },

  // 头像昵称填写（微信新版登录方式）
  showAvatarLogin: function () {
    // 跳转到登录页
    wx.navigateTo({ url: '/pages/login/index' });
  },

  // 退出登录
  onLogout: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          app.clearUserInfo();
          that.setData({
            isLogin: false,
            userInfo: null
          });
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  },

  // 菜单点击
  onMenuTap: function (e) {
    var id = e.currentTarget.dataset.id;
    switch (id) {
      case 'favorites':
        wx.showToast({ title: '功能开发中', icon: 'none' });
        break;
      case 'history':
        wx.showToast({ title: '功能开发中', icon: 'none' });
        break;
      case 'feedback':
        // 打开意见反馈
        if (wx.canIUse('openCustomerServiceChat')) {
          wx.openCustomerServiceChat({
            extInfo: { url: '' },
            corpId: '',
            fail: function () {
              wx.showToast({ title: '请前往小程序社区反馈', icon: 'none' });
            }
          });
        } else {
          wx.showToast({ title: '请前往小程序社区反馈', icon: 'none' });
        }
        break;
      case 'about':
        wx.showModal({
          title: '万能工具箱',
          content: '版本：v1.0.0\n一个小程序，搞定日常生活所有小需求\n\n包含35个实用工具',
          showCancel: false
        });
        break;
    }
  },

  onShareAppMessage: function () {
    return {
      title: '万能工具箱 - 35个实用工具免费用',
      path: '/pages/index/index'
    };
  }
});
