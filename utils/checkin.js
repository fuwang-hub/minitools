// utils/checkin.js - 签到系统

var CHECKIN_KEY = 'checkin_data';

/**
 * 获取签到数据
 */
function getCheckinData() {
  var data = wx.getStorageSync(CHECKIN_KEY) || {
    totalDays: 0,      // 累计签到天数
    streak: 0,         // 连续签到天数
    lastDate: '',      // 上次签到日期
    history: [],       // 签到历史 [{date, time}]
    points: 0          // 签到积分
  };
  return data;
}

/**
 * 执行签到
 * @returns {object} { success, isNew, streak, points, reward }
 */
function doCheckin() {
  var data = getCheckinData();
  var today = new Date().toISOString().split('T')[0];

  // 已签到
  if (data.lastDate === today) {
    return { success: false, isNew: false, streak: data.streak, points: data.points, msg: '今日已签到' };
  }

  // 计算连续天数
  var yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (data.lastDate === yesterday) {
    data.streak++;
  } else {
    data.streak = 1;
  }

  data.totalDays++;
  data.lastDate = today;
  data.history.push({ date: today, time: Date.now() });

  // 只保留最近90天
  if (data.history.length > 90) data.history = data.history.slice(-90);

  // 签到奖励积分（连续签到越多积分越高）
  var reward = 10;
  if (data.streak >= 7) reward = 30;
  else if (data.streak >= 3) reward = 20;
  data.points += reward;

  wx.setStorageSync(CHECKIN_KEY, data);

  return {
    success: true,
    isNew: true,
    streak: data.streak,
    totalDays: data.totalDays,
    points: data.points,
    reward: reward,
    msg: '签到成功！+' + reward + '积分'
  };
}

/**
 * 检查今日是否已签到
 */
function isCheckedToday() {
  var data = getCheckinData();
  var today = new Date().toISOString().split('T')[0];
  return data.lastDate === today;
}

/**
 * 请求订阅消息授权
 * @param {string} tmplId - 模板消息ID
 */
function requestSubscribe(tmplId) {
  if (!tmplId) return;
  wx.requestSubscribeMessage({
    tmplIds: [tmplId],
    success: function(res) {
      console.log('订阅消息授权:', res);
    },
    fail: function() {
      // 用户拒绝，不阻断流程
    }
  });
}

module.exports = {
  getCheckinData: getCheckinData,
  doCheckin: doCheckin,
  isCheckedToday: isCheckedToday,
  requestSubscribe: requestSubscribe
};
