// pages/login/index.js
// 微信新版登录：button open-type="chooseAvatar" + input type="nickname"
var app = getApp();

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    defaultAvatar: '/images/default-avatar.png'
  },

  // 选择头像（微信原生头像选择器）
  onChooseAvatar: function (e) {
    this.setData({ avatarUrl: e.detail.avatarUrl });
  },

  // 输入昵称
  onNicknameInput: function (e) {
    this.setData({ nickName: e.detail.value });
  },

  // 确认登录
  onConfirmLogin: function () {
    var that = this;
    var avatarUrl = this.data.avatarUrl;
    var nickName = this.data.nickName.trim();

    if (!avatarUrl) {
      wx.showToast({ title: '请选择头像', icon: 'none' });
      return;
    }
    if (!nickName) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    // 调用 wx.login 获取 code
    wx.login({
      success: function (res) {
        var userInfo = {
          avatarUrl: avatarUrl,
          nickName: nickName,
          code: res.code || '',
          loginTime: Date.now()
        };

        // 保存到全局
        app.setUserInfo(userInfo);

        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500,
          success: function () {
            setTimeout(function () {
              wx.navigateBack();
            }, 1500);
          }
        });
      },
      fail: function () {
        // wx.login 失败也允许保存基本信息
        var userInfo = {
          avatarUrl: avatarUrl,
          nickName: nickName,
          loginTime: Date.now()
        };
        app.setUserInfo(userInfo);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(function () { wx.navigateBack(); }, 1500);
      }
    });
  },

  // 跳过登录
  onSkip: function () {
    wx.navigateBack();
  }
});
