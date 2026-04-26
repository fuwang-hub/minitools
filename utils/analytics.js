/**
 * 数据埋点 SDK
 * 
 * 功能：
 * 1. 页面浏览 PV/UV
 * 2. 工具使用次数
 * 3. 按钮点击事件
 * 4. 分享事件
 * 5. 广告展示/点击
 * 6. 用户注册/登录
 * 7. 留存计算
 * 8. 自定义事件
 * 
 * 数据存储：本地 Storage + 可选服务端上报
 * 
 * 使用方式：
 *   var analytics = require('../utils/analytics');
 *   analytics.trackPage('calculator');
 *   analytics.trackEvent('tool_use', { tool: 'calculator' });
 */

var STORAGE_KEY = '_analytics_data';
var DAILY_KEY = '_analytics_daily';
var SESSION_KEY = '_analytics_session';
var RETENTION_KEY = '_analytics_retention';

// ========== 基础工具 ==========

function today() {
  var d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function now() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function uuid() {
  return 'xxxx-xxxx'.replace(/x/g, function() {
    return (Math.random() * 16 | 0).toString(16);
  }) + '-' + Date.now().toString(36);
}

// ========== 存储层 ==========

function getData() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || initData();
  } catch (e) {
    return initData();
  }
}

function saveData(data) {
  try {
    wx.setStorageSync(STORAGE_KEY, data);
  } catch (e) {}
}

function getDailyData() {
  try {
    var d = wx.getStorageSync(DAILY_KEY) || {};
    if (d.date !== today()) {
      d = { date: today(), pv: 0, uv: 0, events: {}, tools: {}, pages: {} };
    }
    return d;
  } catch (e) {
    return { date: today(), pv: 0, uv: 0, events: {}, tools: {}, pages: {} };
  }
}

function saveDailyData(d) {
  try {
    wx.setStorageSync(DAILY_KEY, d);
  } catch (e) {}
}

function initData() {
  var data = {
    // 用户标识
    uid: uuid(),
    firstVisit: now(),
    lastVisit: '',
    
    // 累计数据
    totalPV: 0,
    totalSessions: 0,
    totalToolUse: 0,
    totalShares: 0,
    totalAdViews: 0,
    
    // 注册信息
    registered: false,
    registerTime: '',
    
    // 工具使用详情 { toolName: count }
    toolUsage: {},
    
    // 页面浏览详情 { pagePath: count }
    pageViews: {},
    
    // 事件记录 [{ event, data, time }] 最近100条
    eventLog: [],
    
    // 留存数据
    visitDays: [],  // 所有访问日期
    
    // 分享数据
    shareLog: [],   // 最近50条分享记录
    
    // 广告数据
    adStats: {
      bannerShow: 0,
      bannerClick: 0,
      interstitialShow: 0,
      interstitialClick: 0,
      rewardShow: 0,
      rewardComplete: 0
    }
  };
  saveData(data);
  return data;
}

// ========== 核心埋点方法 ==========

/**
 * 记录会话开始（app.onLaunch/onShow 调用）
 */
function trackSession(scene) {
  var data = getData();
  data.totalSessions++;
  data.lastVisit = now();
  
  // 记录访问日期（用于留存计算）
  var d = today();
  if (data.visitDays.indexOf(d) < 0) {
    data.visitDays.push(d);
    // 只保留最近90天
    if (data.visitDays.length > 90) {
      data.visitDays = data.visitDays.slice(-90);
    }
  }
  
  // 更新留存数据
  updateRetention(data);
  
  // 记录场景值
  addEvent(data, 'session_start', { scene: scene || 0 });
  
  saveData(data);
  
  // 更新日数据
  var daily = getDailyData();
  daily.uv = 1; // 当天有访问
  saveDailyData(daily);
}

/**
 * 记录页面浏览
 */
function trackPage(pagePath) {
  if (!pagePath) return;
  
  var data = getData();
  data.totalPV++;
  data.pageViews[pagePath] = (data.pageViews[pagePath] || 0) + 1;
  saveData(data);
  
  var daily = getDailyData();
  daily.pv++;
  daily.pages[pagePath] = (daily.pages[pagePath] || 0) + 1;
  saveDailyData(daily);
}

/**
 * 记录工具使用
 */
function trackToolUse(toolName, extra) {
  if (!toolName) return;
  
  var data = getData();
  data.totalToolUse++;
  data.toolUsage[toolName] = (data.toolUsage[toolName] || 0) + 1;
  
  addEvent(data, 'tool_use', Object.assign({ tool: toolName }, extra || {}));
  saveData(data);
  
  var daily = getDailyData();
  daily.tools[toolName] = (daily.tools[toolName] || 0) + 1;
  saveDailyData(daily);
  
  // 同时上报微信官方数据分析
  try {
    wx.reportAnalytics('tool_use', {
      tool_name: toolName
    });
  } catch (e) {}
}

/**
 * 记录自定义事件
 */
function trackEvent(eventName, eventData) {
  if (!eventName) return;
  
  var data = getData();
  addEvent(data, eventName, eventData || {});
  saveData(data);
  
  var daily = getDailyData();
  daily.events[eventName] = (daily.events[eventName] || 0) + 1;
  saveDailyData(daily);
  
  // 上报微信官方
  try {
    wx.reportAnalytics(eventName, eventData || {});
  } catch (e) {}
}

/**
 * 记录按钮点击
 */
function trackClick(buttonName, pagePath) {
  trackEvent('button_click', {
    button: buttonName,
    page: pagePath || ''
  });
}

/**
 * 记录分享事件
 */
function trackShare(type, page, title) {
  var data = getData();
  data.totalShares++;
  
  var record = {
    type: type || 'friend',  // friend / timeline / poster
    page: page || '',
    title: title || '',
    time: now()
  };
  data.shareLog.push(record);
  if (data.shareLog.length > 50) {
    data.shareLog = data.shareLog.slice(-50);
  }
  
  addEvent(data, 'share', record);
  saveData(data);
  
  try {
    wx.reportAnalytics('share', {
      share_type: type || 'friend',
      share_page: page || ''
    });
  } catch (e) {}
}

/**
 * 记录广告事件
 */
function trackAd(adType, action) {
  var data = getData();
  var key = adType + (action === 'show' ? 'Show' : action === 'click' ? 'Click' : 'Complete');
  if (data.adStats[key] !== undefined) {
    data.adStats[key]++;
  }
  if (action === 'show') data.totalAdViews++;
  
  addEvent(data, 'ad_' + action, { ad_type: adType });
  saveData(data);
  
  try {
    wx.reportAnalytics('ad_event', {
      ad_type: adType,
      ad_action: action
    });
  } catch (e) {}
}

/**
 * 记录用户注册
 */
function trackRegister(userInfo) {
  var data = getData();
  data.registered = true;
  data.registerTime = now();
  
  addEvent(data, 'register', {
    nickname: (userInfo && userInfo.nickName) || '',
    hasAvatar: !!(userInfo && userInfo.avatarUrl)
  });
  saveData(data);
  
  try {
    wx.reportAnalytics('register', {});
  } catch (e) {}
}

/**
 * 记录登录
 */
function trackLogin() {
  trackEvent('login', { time: now() });
}

/**
 * 记录签到
 */
function trackCheckin(consecutiveDays, totalPoints) {
  trackEvent('checkin', {
    consecutive: consecutiveDays || 1,
    points: totalPoints || 0
  });
}

// ========== 数据查询方法 ==========

/**
 * 获取概览数据
 */
function getOverview() {
  var data = getData();
  var daily = getDailyData();
  
  return {
    // 用户信息
    uid: data.uid,
    firstVisit: data.firstVisit,
    lastVisit: data.lastVisit,
    registered: data.registered,
    registerTime: data.registerTime,
    
    // 累计数据
    totalPV: data.totalPV,
    totalSessions: data.totalSessions,
    totalToolUse: data.totalToolUse,
    totalShares: data.totalShares,
    totalAdViews: data.totalAdViews,
    
    // 今日数据
    todayPV: daily.pv,
    todayTools: Object.keys(daily.tools).length,
    todayEvents: Object.keys(daily.events).reduce(function(sum, k) { return sum + daily.events[k]; }, 0),
    
    // 留存
    totalVisitDays: data.visitDays.length,
    retention: getRetention()
  };
}

/**
 * 获取工具使用排行
 */
function getToolRanking() {
  var data = getData();
  var tools = data.toolUsage;
  var list = Object.keys(tools).map(function(k) {
    return { name: k, count: tools[k] };
  });
  list.sort(function(a, b) { return b.count - a.count; });
  return list;
}

/**
 * 获取页面浏览排行
 */
function getPageRanking() {
  var data = getData();
  var pages = data.pageViews;
  var list = Object.keys(pages).map(function(k) {
    return { path: k, count: pages[k] };
  });
  list.sort(function(a, b) { return b.count - a.count; });
  return list;
}

/**
 * 获取今日数据
 */
function getTodayStats() {
  return getDailyData();
}

/**
 * 获取事件日志（最近N条）
 */
function getEventLog(limit) {
  var data = getData();
  var log = data.eventLog || [];
  return log.slice(-(limit || 20));
}

/**
 * 获取分享数据
 */
function getShareStats() {
  var data = getData();
  var total = data.totalShares;
  var byType = {};
  var byPage = {};
  (data.shareLog || []).forEach(function(s) {
    byType[s.type] = (byType[s.type] || 0) + 1;
    byPage[s.page] = (byPage[s.page] || 0) + 1;
  });
  return { total: total, byType: byType, byPage: byPage, recent: (data.shareLog || []).slice(-10) };
}

/**
 * 获取广告数据
 */
function getAdStats() {
  var data = getData();
  return data.adStats;
}

// ========== 留存计算 ==========

function updateRetention(data) {
  var days = data.visitDays;
  if (days.length < 2) return;
  
  var ret = {};
  var first = days[0];
  
  // 计算 N 日留存
  [1, 2, 3, 7, 14, 30].forEach(function(n) {
    var target = addDays(first, n);
    ret['d' + n] = days.indexOf(target) >= 0;
  });
  
  try {
    wx.setStorageSync(RETENTION_KEY, ret);
  } catch (e) {}
}

function getRetention() {
  try {
    return wx.getStorageSync(RETENTION_KEY) || {};
  } catch (e) {
    return {};
  }
}

function addDays(dateStr, n) {
  var d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

// ========== 服务端上报（预留接口） ==========

/**
 * 批量上报数据到服务端
 * 需要配置 REPORT_URL 后启用
 */
var REPORT_URL = '';  // 配置你的数据接收服务端地址

function reportToServer() {
  if (!REPORT_URL) return;
  
  var data = getData();
  var daily = getDailyData();
  
  var payload = {
    uid: data.uid,
    date: today(),
    timestamp: now(),
    overview: getOverview(),
    toolRanking: getToolRanking().slice(0, 20),
    todayStats: daily,
    adStats: data.adStats,
    shareStats: getShareStats(),
    retention: getRetention()
  };
  
  wx.request({
    url: REPORT_URL,
    method: 'POST',
    header: { 'content-type': 'application/json' },
    data: payload,
    success: function() {
      console.log('[Analytics] 上报成功');
    },
    fail: function(err) {
      console.log('[Analytics] 上报失败', err);
    }
  });
}

/**
 * 导出数据为JSON（调试用）
 */
function exportData() {
  return {
    raw: getData(),
    daily: getDailyData(),
    overview: getOverview(),
    toolRanking: getToolRanking(),
    pageRanking: getPageRanking(),
    shareStats: getShareStats(),
    adStats: getAdStats(),
    retention: getRetention()
  };
}

/**
 * 清除所有埋点数据（慎用）
 */
function clearAll() {
  try {
    wx.removeStorageSync(STORAGE_KEY);
    wx.removeStorageSync(DAILY_KEY);
    wx.removeStorageSync(SESSION_KEY);
    wx.removeStorageSync(RETENTION_KEY);
  } catch (e) {}
}

// ========== 内部工具 ==========

function addEvent(data, event, eventData) {
  data.eventLog = data.eventLog || [];
  data.eventLog.push({
    event: event,
    data: eventData,
    time: now()
  });
  // 只保留最近200条
  if (data.eventLog.length > 200) {
    data.eventLog = data.eventLog.slice(-200);
  }
}

// ========== 导出 ==========

module.exports = {
  // 埋点方法
  trackSession: trackSession,
  trackPage: trackPage,
  trackToolUse: trackToolUse,
  trackEvent: trackEvent,
  trackClick: trackClick,
  trackShare: trackShare,
  trackAd: trackAd,
  trackRegister: trackRegister,
  trackLogin: trackLogin,
  trackCheckin: trackCheckin,
  
  // 查询方法
  getOverview: getOverview,
  getToolRanking: getToolRanking,
  getPageRanking: getPageRanking,
  getTodayStats: getTodayStats,
  getEventLog: getEventLog,
  getShareStats: getShareStats,
  getAdStats: getAdStats,
  getRetention: getRetention,
  
  // 管理方法
  reportToServer: reportToServer,
  exportData: exportData,
  clearAll: clearAll
};
