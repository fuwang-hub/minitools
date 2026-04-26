var analytics = require('../../../utils/analytics');
// pages/test/enneagram/index.js

var QUESTIONS = [
  { id: 1, text: '在团队中，你通常扮演什么角色？', options: ['追求完美的质检员', '帮助他人的协调者', '推动目标的执行者'], types: [1, 2, 3] },
  { id: 2, text: '面对压力时，你最可能：', options: ['变得更加挑剔和焦虑', '寻求他人安慰和支持', '更加努力工作'], types: [1, 2, 3] },
  { id: 3, text: '你最看重什么？', options: ['独特性和深度', '安全感和忠诚', '自由和快乐'], types: [4, 6, 7] },
  { id: 4, text: '别人最常说你：', options: ['很有主见和魄力', '很温和很好相处', '很有知识很独立'], types: [8, 9, 5] },
  { id: 5, text: '你的内在驱动力是：', options: ['做正确的事', '被人需要和喜爱', '获得成功和认可'], types: [1, 2, 3] },
  { id: 6, text: '独处时你倾向于：', options: ['沉浸在自己的情感世界', '研究感兴趣的知识', '计划下一次冒险'], types: [4, 5, 7] },
  { id: 7, text: '你最害怕什么？', options: ['失去控制和被伤害', '冲突和不和谐', '被背叛和没有支持'], types: [8, 9, 6] },
  { id: 8, text: '在感情中你更倾向于：', options: ['全心投入表达情感', '理性分析保持距离', '给予对方空间和自由'], types: [2, 5, 9] },
  { id: 9, text: '你的工作风格是：', options: ['注重细节力求完美', '高效目标导向', '灵活多变富有创意'], types: [1, 3, 7] }
];

var TYPE_INFO = {
  1: { name: '完美主义者', wing: '改革者', emoji: '✨', color: '#8B5CF6',
    traits: ['原则性强', '有责任感', '追求完美', '自律严格'],
    strengths: '你有强烈的是非观和道德感，做事认真负责，追求卓越品质。',
    weaknesses: '容易对自己和他人过于苛刻，有时过于执着于细节。',
    advice: '学会接受不完美，对自己和他人多一些包容。完美是方向，不是终点。' },
  2: { name: '助人者', wing: '给予者', emoji: '💝', color: '#EC4899',
    traits: ['热心助人', '善解人意', '慷慨大方', '情感丰富'],
    strengths: '你天生善于理解他人需求，乐于付出，是朋友圈中的暖心存在。',
    weaknesses: '可能忽视自己的需求，过度依赖他人的认可和感激。',
    advice: '学会照顾自己，你值得被爱不是因为你做了什么，而是因为你就是你。' },
  3: { name: '成就者', wing: '实干家', emoji: '🏆', color: '#F59E0B',
    traits: ['目标导向', '适应力强', '精力充沛', '注重形象'],
    strengths: '你有极强的执行力和目标感，善于展示自己，总能完成任务。',
    weaknesses: '可能过于在意外在评价，有时会忽略内心真实感受。',
    advice: '放慢脚步，倾听内心。真正的成功不只是外在成就，还有内心的满足。' },
  4: { name: '个人主义者', wing: '艺术家', emoji: '🎨', color: '#6366F1',
    traits: ['感受深刻', '富有创意', '追求独特', '情感真挚'],
    strengths: '你有独特的审美和深刻的情感世界，善于用创意表达自我。',
    weaknesses: '容易陷入情绪低谷，有时过于关注自己缺失的东西。',
    advice: '珍惜当下拥有的，你的独特是天赋而非负担。用创造力点亮生活。' },
  5: { name: '观察者', wing: '思考者', emoji: '🔬', color: '#0EA5E9',
    traits: ['善于分析', '独立思考', '求知欲强', '冷静客观'],
    strengths: '你有出色的分析能力和求知欲，善于深入研究复杂问题。',
    weaknesses: '可能过于退缩到思维世界，社交互动较少。',
    advice: '知识是力量，但连接也是。试着多走出舒适区，与人分享你的智慧。' },
  6: { name: '忠诚者', wing: '守护者', emoji: '🛡️', color: '#059669',
    traits: ['忠诚可靠', '责任感强', '善于预判', '重视安全'],
    strengths: '你是最可靠的朋友和同事，善于预见风险，有强烈的责任感。',
    weaknesses: '容易焦虑和过度担忧，有时难以做出决定。',
    advice: '相信自己的判断力，你比想象中更强大。勇气不是没有恐惧，而是带着恐惧前行。' },
  7: { name: '享乐主义者', wing: '冒险家', emoji: '🎉', color: '#F97316',
    traits: ['乐观积极', '精力充沛', '创意丰富', '热爱自由'],
    strengths: '你是天生的乐观派，善于发现生活的美好，给身边人带来快乐。',
    weaknesses: '可能逃避负面情绪，注意力容易分散，难以坚持到底。',
    advice: '快乐很重要，但深度也很重要。试着在一件事上深耕，你会发现不一样的快乐。' },
  8: { name: '挑战者', wing: '领袖', emoji: '👑', color: '#DC2626',
    traits: ['自信果断', '意志坚定', '保护弱者', '直来直去'],
    strengths: '你有天生的领导力和保护欲，敢于面对挑战，为弱者发声。',
    weaknesses: '可能过于强势和控制，有时忽视他人感受。',
    advice: '真正的强大包含温柔。展示脆弱不是软弱，而是更高层次的勇气。' },
  9: { name: '和平主义者', wing: '调解者', emoji: '🕊️', color: '#6B7280',
    traits: ['温和包容', '善于调解', '随和耐心', '内心平静'],
    strengths: '你有超强的共情能力和包容心，善于化解冲突，营造和谐氛围。',
    weaknesses: '可能过于回避冲突，压抑自己的需求和想法。',
    advice: '你的声音同样重要。表达自己的需求不是自私，而是对自己和关系的负责。' }
};

Page({
  onLoad: function() {
    analytics.trackPage('enneagram');
    analytics.startStay('enneagram');
    analytics.trackFunnelStart('enneagram');
    analytics.trackToolUse('enneagram');
    this.setData({ questions: QUESTIONS });
  },

  data: {
    questions: [],
    currentQuestion: 0,
    answers: [],
    showResult: false,
    showPoster: false,
    posterData: {},
    detailUnlocked: false,
    result: null,
    progress: 0
  },

  handleAnswer: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var currentQuestion = this.data.currentQuestion;
    var newAnswers = this.data.answers.concat([index]);

    if (currentQuestion < QUESTIONS.length - 1) {
      this.setData({
        currentQuestion: currentQuestion + 1,
        answers: newAnswers,
        progress: Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)
      });
    } else {
      this._calculateResult(newAnswers);
    }
  },

  _calculateResult: function(answers) {
    var scores = {};
    for (var i = 1; i <= 9; i++) scores[i] = 0;

    answers.forEach(function(ansIdx, qIdx) {
      var q = QUESTIONS[qIdx];
      var t = q.types[ansIdx];
      scores[t] += 2;
      q.types.forEach(function(type, i) {
        if (i !== ansIdx) scores[type] += 0.5;
      });
    });

    var maxType = 1, maxScore = 0;
    for (var t = 1; t <= 9; t++) {
      if (scores[t] > maxScore) { maxScore = scores[t]; maxType = t; }
    }

    // 翼型
    var wing1 = maxType === 1 ? 9 : maxType - 1;
    var wing2 = maxType === 9 ? 1 : maxType + 1;
    var wingType = scores[wing1] >= scores[wing2] ? wing1 : wing2;

    var info = TYPE_INFO[maxType];
    this.setData({
      showResult: true,
      _funnelDone: true,
      progress: 100,
      result: {
        type: maxType,
        wingType: wingType,
        name: info.name,
        emoji: info.emoji,
        color: info.color,
        traits: info.traits,
        strengths: info.strengths,
        weaknesses: info.weaknesses,
        advice: info.advice,
        desc: info.strengths
      }
    });
    analytics.trackFunnelComplete('enneagram');
    analytics.trackResultView('enneagram');
  },

  restart: function() {
    this.setData({ currentQuestion: 0, answers: [], showResult: false, result: null, progress: 0 });
  },

  onHide: function() { analytics.endStay('enneagram'); },


  onUnload: function() { analytics.endStay('enneagram'); },



  onShareAppMessage: function() {
    analytics.trackShare('friend', 'enneagram');
    var share = require('../../../utils/share');
    var r = this.data.result || {};
    return share.buildShareConfig('enneagram', { result: r.name || '' }, '/pages/test/enneagram/index');
  },

  onShareTimeline: function() {
    var share = require('../../../utils/share');
    var r = this.data.result || {};
    return share.buildTimelineConfig('enneagram', { result: r.name || '' });
  },

  showPoster: function() {
    var r = this.data.result || {};
    this.setData({
      showPoster: true,
      posterData: {
        emoji: r.emoji || '🔢', title: '九型人格测试', subtitle: '我的人格类型',
        result: '第' + r.type + '型', highlight: r.name || '', desc: r.strengths || '',
        qrTip: '扫一扫，测测你是九型中的哪一型！'
      }
    });
  },

  closePoster: function() { this.setData({ showPoster: false }); },
  onUnlocked: function() { this.setData({ detailUnlocked: true }); }
});
