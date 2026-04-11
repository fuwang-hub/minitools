/**
 * 工具函数集
 */

// 格式化日期
function formatDate(date, fmt) {
  fmt = fmt || 'yyyy-MM-dd';
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
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
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

/**
 * 防抖函数
 * @param {Function} fn - 目标函数
 * @param {number} delay - 延迟毫秒
 */
function debounce(fn, delay) {
  var timer = null;
  return function() {
    var ctx = this;
    var args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(ctx, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn - 目标函数
 * @param {number} interval - 间隔毫秒
 */
function throttle(fn, interval) {
  var last = 0;
  return function() {
    var now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, arguments);
    }
  };
}

/**
 * 显示插屏广告（复用全局实例）
 */
function showInterstitialAd() {
  var app = getApp();
  var ad = app.getInterstitialAd();
  if (ad) {
    ad.show().catch(function() {});
  }
}

/**
 * 显示激励视频广告（复用全局实例）
 */
function showRewardedVideo() {
  return new Promise(function(resolve, reject) {
    var app = getApp();
    var ad = app.getRewardedAd();
    if (!ad) {
      resolve(true); // 开发环境直接通过
      return;
    }
    ad.onClose(function handler(res) {
      ad.offClose(handler);
      if (res && res.isEnded) {
        resolve(true);
      } else {
        reject(new Error('用户提前关闭'));
      }
    });
    ad.show().catch(function() {
      ad.load().then(function() { return ad.show(); }).catch(reject);
    });
  });
}

/**
 * 安全的 setData（只更新变化的字段，减少渲染开销）
 * @param {Object} page - 页面实例 (this)
 * @param {Object} data - 要设置的数据
 * @param {Function} callback - 回调
 */
function safeSetData(page, data, callback) {
  if (!page || !data) return;
  var diff = {};
  var hasDiff = false;
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      // 简单比较，对象/数组总是更新
      if (typeof data[key] !== 'object' && page.data[key] === data[key]) continue;
      diff[key] = data[key];
      hasDiff = true;
    }
  }
  if (hasDiff) {
    page.setData(diff, callback);
  } else if (callback) {
    callback();
  }
}

/**
 * 带缓存的数据获取
 * @param {string} key - 缓存键
 * @param {Function} fetchFn - 无缓存时的数据获取函数，需返回 Promise
 * @param {number} expireMs - 过期毫秒数
 */
function cachedFetch(key, fetchFn, expireMs) {
  var app = getApp();
  var cached = app.getCache(key);
  if (cached) {
    return Promise.resolve(cached);
  }
  return fetchFn().then(function(data) {
    app.setCache(key, data, expireMs);
    return data;
  });
}

module.exports = {
  formatDate: formatDate,
  randomInt: randomInt,
  shuffle: shuffle,
  debounce: debounce,
  throttle: throttle,
  showInterstitialAd: showInterstitialAd,
  showRewardedVideo: showRewardedVideo,
  safeSetData: safeSetData,
  cachedFetch: cachedFetch
};
