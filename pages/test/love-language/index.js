var analytics = require('../../../utils/analytics');
// pages/test/love-language/index.js
const questions = [
  { id: 1, text: '你更希望伴侣怎样表达爱意？', a: '经常说"我爱你"和甜蜜的话', b: '给你一个温暖的拥抱', da: 'W', db: 'T' },
  { id: 2, text: '什么让你感觉最被爱？', a: '收到精心准备的礼物', b: '对方放下手机专心陪你', da: 'G', db: 'Q' },
  { id: 3, text: '你更喜欢哪种约会方式？', a: '一起做家务聊天', b: '收到一束意外的花', da: 'A', db: 'G' },
  { id: 4, text: '吵架后你最需要什么？', a: '对方的一句"对不起，我爱你"', b: '对方默默帮你做些事情', da: 'W', db: 'A' },
  { id: 5, text: '纪念日你更期待：', a: '一整天不被打扰的二人时光', b: '牵手散步依偎在一起', da: 'Q', db: 'T' },
  { id: 6, text: '你觉得什么最浪漫？', a: '写一封情书给你', b: '帮你按摩放松', da: 'W', db: 'T' },
  { id: 7, text: '出差回来你最期待：', a: '对方准备的惊喜小礼物', b: '一个大大的拥抱', da: 'G', db: 'T' },
  { id: 8, text: '日常中什么让你开心？', a: '对方主动帮你做事', b: '对方陪你一起做喜欢的事', da: 'A', db: 'Q' },
  { id: 9, text: '你更在意：', a: '对方嘴上的肯定和赞美', b: '对方记住你提过想要的东西', da: 'W', db: 'G' },
  { id: 10, text: '什么让你觉得最幸福？', a: '周末一起宅家看电影', b: '对方默默替你分担压力', da: 'Q', db: 'A' }
];

const langInfo = {
  W: { name: '肯定的言语', emoji: '💬', color: '#EC4899', en: 'Words of Affirmation',
    desc: '你的爱情语言是甜蜜的话语。你需要听到"我爱你"、赞美和鼓励，文字和语言是你感受爱意的主要方式。',
    tips: ['多对你的伴侣说"我爱你"', '真诚地赞美对方', '写小纸条或发甜蜜的消息', '在朋友面前夸奖对方', '吵架时注意言辞，避免伤人'],
    match: '你最需要一个善于表达、不吝啬赞美的伴侣。' },
  T: { name: '身体接触', emoji: '🤗', color: '#8B5CF6', en: 'Physical Touch',
    desc: '你的爱情语言是肢体接触。拥抱、牵手、依偎让你感受到深深的爱意和安全感。',
    tips: ['多拥抱和牵手', '看电视时依偎在一起', '出门时自然地搭肩或挽手', '经常亲吻对方', '给对方按摩放松'],
    match: '你最需要一个喜欢亲密接触、不介意公开表达亲密的伴侣。' },
  G: { name: '接收礼物', emoji: '🎁', color: '#F59E0B', en: 'Receiving Gifts',
    desc: '你的爱情语言是收到礼物。礼物本身不重要，重要的是对方"想着你"的这份心意。',
    tips: ['记住对方提过想要的东西', '不需要贵重，用心最重要', '特殊日子准备小惊喜', '旅行时带回小纪念品', '日常中偶尔的小礼物'],
    match: '你最需要一个心思细腻、善于记住你需求的伴侣。' },
  Q: { name: '精心时刻', emoji: '⏰', color: '#0EA5E9', en: 'Quality Time',
    desc: '你的爱情语言是高质量的陪伴。你需要对方全心全意的关注，而不只是在同一空间。',
    tips: ['约会时放下手机', '一起培养共同爱好', '定期安排二人约会', '认真倾听对方说话', '一起散步聊天'],
    match: '你最需要一个愿意花时间、专注陪伴你的伴侣。' },
  A: { name: '服务行动', emoji: '🛠️', color: '#059669', en: 'Acts of Service',
    desc: '你的爱情语言是行动付出。对方帮你做事、分担压力，比说一百句甜言蜜语更让你感动。',
    tips: ['主动帮对方做家务', '在对方忙碌时分担任务', '帮对方解决实际问题', '在对方生病时悉心照顾', '不用被要求就主动去做'],
    match: '你最需要一个行动派、愿意为你付出的伴侣。' }
};

Page({
  onLoad: function() {
    analytics.trackPage('love-language');
    analytics.trackToolUse('love-language');
  },
  data: {
    currentQuestion: 0,
    showResult: false,
    result: null,
    allResults: [],
    progress: 0
  },

  chooseOption(e) {
    const { option } = e.currentTarget.dataset;
    const { currentQuestion } = this.data;
    const q = questions[currentQuestion];
    const type = option === 'a' ? q.da : q.db;

    const scores = this.data.scores || { W: 0, T: 0, G: 0, Q: 0, A: 0 };
    scores[type]++;

    if (currentQuestion < questions.length - 1) {
      this.setData({
        currentQuestion: currentQuestion + 1,
        scores,
        progress: Math.round(((currentQuestion + 1) / questions.length) * 100)
      });
    } else {
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const allResults = sorted.map(([k, v]) => ({
        ...langInfo[k],
        score: v,
        percent: Math.round((v / questions.length) * 100)
      }));
      this.setData({
        showResult: true,
        progress: 100,
        result: langInfo[sorted[0][0]],
        allResults
      });
    }
  },

  restart() {
    this.setData({ currentQuestion: 0, showResult: false, result: null, allResults: [], scores: { W: 0, T: 0, G: 0, Q: 0, A: 0 }, progress: 0 });
  },

  onShareAppMessage() {
    var share = require('../../../utils/share');
    var r = this.data.result || {};
    return share.buildShareConfig('love-language', { result: r.name || '' }, '/pages/test/love-language/index');
  },

  onShareTimeline() {
    var share = require('../../../utils/share');
    var r = this.data.result || {};
    return share.buildTimelineConfig('love-language', { result: r.name || '' });
  },

  showPoster() {
    var r = this.data.result || {};
    this.setData({
      showPoster: true,
      posterData: {
        emoji: r.emoji || '💕', title: '爱情语言测试', subtitle: '我的爱情语言是',
        result: r.name || '', highlight: '', desc: r.desc || '',
        qrTip: '扫一扫，测测你的爱情语言是什么！'
      }
    });
  },

  closePoster() { this.setData({ showPoster: false }); },
  onUnlocked() { this.setData({ detailUnlocked: true }); }
});
