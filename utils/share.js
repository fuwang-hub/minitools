// utils/share.js - 社交分享管理器

var SHARE_KEY = 'share_records';
var UNLOCK_KEY = 'share_unlocks';

/**
 * 记录分享行为
 * @param {string} page - 分享来源页面
 * @param {string} type - 分享类型 friend/group/poster
 */
function recordShare(page, type) {
  var records = wx.getStorageSync(SHARE_KEY) || [];
  records.push({
    page: page,
    type: type || 'friend',
    time: Date.now()
  });
  // 只保留最近100条
  if (records.length > 100) records = records.slice(-100);
  wx.setStorageSync(SHARE_KEY, records);
}

/**
 * 获取分享统计
 */
function getShareStats() {
  var records = wx.getStorageSync(SHARE_KEY) || [];
  var today = new Date().toDateString();
  var todayCount = records.filter(function(r) {
    return new Date(r.time).toDateString() === today;
  }).length;
  return {
    total: records.length,
    today: todayCount,
    records: records
  };
}

/**
 * 检查页面是否已通过分享解锁
 * @param {string} pageKey - 页面标识
 */
function isUnlocked(pageKey) {
  var unlocks = wx.getStorageSync(UNLOCK_KEY) || {};
  return !!unlocks[pageKey];
}

/**
 * 解锁页面（分享后调用）
 * @param {string} pageKey - 页面标识
 */
function unlock(pageKey) {
  var unlocks = wx.getStorageSync(UNLOCK_KEY) || {};
  unlocks[pageKey] = Date.now();
  wx.setStorageSync(UNLOCK_KEY, unlocks);
}

/**
 * 构建分享卡片标题（带钩子）
 * @param {string} type - 分享场景
 * @param {object} data - 分享数据
 */
function buildShareTitle(type, data) {
  var templates = {
    'mbti': [
      '我的MBTI是' + (data.result || '') + '，你是什么型？测一下！',
      '刚测了MBTI，结果是' + (data.result || '') + '！你也来试试',
      (data.result || '') + (data.name || '') + '！你的性格类型是？'
    ],
    'enneagram': [
      '我是九型人格中的' + (data.result || '') + '，你呢？',
      '九型人格测试：我是' + (data.result || '') + '型！来测测你的'
    ],
    'career': [
      '测试结果：我最适合做' + (data.result || '') + '！你适合什么？',
      '职业倾向测试：' + (data.result || '') + '，准不准你说了算'
    ],
    'love-language': [
      '我的爱情语言是' + (data.result || '') + '，你的呢？',
      '原来我最需要的是' + (data.result || '') + '！测测你的爱情语言'
    ],
    'fun': [
      data.result || '这个测试太有趣了，你也来试试！',
      '我的结果是' + (data.result || '') + '😂 你呢？'
    ],
    'horoscope-match': [
      '我和' + (data.sign || 'TA') + '的配对分数是' + (data.score || '??') + '分！',
      (data.sign1 || '') + ' × ' + (data.sign2 || '') + ' 配对' + (data.score || '??') + '分，你和TA呢？'
    ],
    'zodiac-match': [
      (data.z1 || '') + '和' + (data.z2 || '') + '的缘分指数' + (data.score || '??') + '分！',
      '属相配对：' + (data.score || '??') + '分！你和TA配不配？'
    ],
    'daily': [
      '今日' + (data.sign || '') + '运势：' + (data.stars || '') + '，查查你的！',
      (data.sign || '') + '今日运势来了！你的星座运势如何？'
    ],
    'divination': [
      '我求到了' + (data.type || '') + '！' + (data.brief || ''),
      '求签结果：' + (data.type || '') + '，你也来试试手气'
    ],
    'acrostic': [
      '送你一首藏头诗，猜猜藏了什么字？',
      'AI帮我写了一首藏头诗，太有才了！'
    ],
    'answer-book': [
      '答案之书告诉我：' + (data.answer || '') + '，你也来问一个！',
      '有问题？让答案之书告诉你！'
    ],
    'name-test': [
      '我的名字评分' + (data.score || '??') + '分！你的名字能打多少分？',
      '姓名测试：' + (data.score || '??') + '分！不服来测'
    ],
    'bazi': [
      '刚看了自己的生辰八字，五行' + (data.result || '') + '！',
      '八字分析太准了！你也来看看你的命理'
    ],
    'dream': [
      '原来梦到' + (data.keyword || '') + '是这个意思！',
      '周公解梦：' + (data.keyword || '') + '的含义竟然是...'
    ],
    'default': [
      '这个小工具太好用了，推荐给你！',
      '万能工具箱：生活中的各种小工具都在这里'
    ]
  };

  var list = templates[type] || templates['default'];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * 生成分享图片路径
 * @param {string} type - 分享场景
 */
function getShareImageUrl(type) {
  // 默认使用分享图
  return '/images/share-default.png';
}

/**
 * 构建 onShareAppMessage 配置
 * @param {string} type - 分享场景
 * @param {object} data - 分享数据
 * @param {string} path - 分享页面路径
 */
function buildShareConfig(type, data, path) {
  recordShare(type, 'friend');
  return {
    title: buildShareTitle(type, data || {}),
    path: path || '/pages/index/index',
    imageUrl: getShareImageUrl(type)
  };
}

/**
 * 构建 onShareTimeline 配置（朋友圈）
 * @param {string} type - 分享场景
 * @param {object} data - 分享数据
 */
function buildTimelineConfig(type, data) {
  recordShare(type, 'timeline');
  return {
    title: buildShareTitle(type, data || {}),
    imageUrl: getShareImageUrl(type)
  };
}

module.exports = {
  recordShare: recordShare,
  getShareStats: getShareStats,
  isUnlocked: isUnlocked,
  unlock: unlock,
  buildShareTitle: buildShareTitle,
  buildShareConfig: buildShareConfig,
  buildTimelineConfig: buildTimelineConfig
};
