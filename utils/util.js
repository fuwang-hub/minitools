/**
 * 工具函数集
 */

// 格式化日期
function formatDate(date, fmt) {
  fmt = fmt || 'yyyy-MM-dd';
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

// 随机整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 打乱数组
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 显示插屏广告
function showInterstitialAd() {
  const app = getApp();
  const id = app.globalData.adUnitIds.interstitial;
  if (!id || id.includes('xxxxxxxxxx')) return;
  if (wx.createInterstitialAd) {
    const ad = wx.createInterstitialAd({ adUnitId: id });
    ad.show().catch(() => {});
  }
}

// 显示激励视频
function showRewardedVideo() {
  return new Promise((resolve, reject) => {
    const app = getApp();
    const id = app.globalData.adUnitIds.rewardedVideo;
    if (!id || id.includes('xxxxxxxxxx')) {
      resolve(true); // 开发环境直接通过
      return;
    }
    if (wx.createRewardedVideoAd) {
      const ad = wx.createRewardedVideoAd({ adUnitId: id });
      ad.onClose((res) => {
        if (res && res.isEnded) {
          resolve(true);
        } else {
          reject(new Error('用户提前关闭'));
        }
      });
      ad.show().catch(() => {
        ad.load().then(() => ad.show()).catch(reject);
      });
    } else {
      resolve(true);
    }
  });
}

module.exports = {
  formatDate,
  randomInt,
  shuffle,
  showInterstitialAd,
  showRewardedVideo
};
