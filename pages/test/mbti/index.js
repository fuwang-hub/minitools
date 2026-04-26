var analytics = require('../../../utils/analytics');
const questions = [
  { text: '在社交场合中，你更倾向于：', options: ['主动结识新朋友', '等待别人来找自己'], dimension: 'EI' },
  { text: '获取信息时，你更关注：', options: ['具体的事实和细节', '整体的概念和可能性'], dimension: 'SN' },
  { text: '做决策时，你更依赖：', options: ['逻辑分析和客观数据', '个人感受和价值观'], dimension: 'TF' },
  { text: '面对任务，你倾向于：', options: ['提前计划按步骤执行', '保持灵活随机应变'], dimension: 'JP' },
  { text: '周末休息时，你更喜欢：', options: ['和朋友外出聚会', '在家独自放松'], dimension: 'EI' },
  { text: '学习新事物时，你更喜欢：', options: ['动手实践操作', '先理解理论框架'], dimension: 'SN' },
  { text: '团队合作中，你更重视：', options: ['效率和最终结果', '团队氛围和成员感受'], dimension: 'TF' },
  { text: '你的日常生活更像：', options: ['有规律有条理', '随性而为灵活多变'], dimension: 'JP' }
];

const mbtiData = {
  INTJ: {
    name: '建筑师', emoji: '🏛️',
    desc: '独立自主的战略思想家，善于将创意转化为实际的行动方案。你天生具有领导力，总能透过现象看到事物的本质。',
    traits: ['独立思考，逻辑严密', '追求完美，标准极高', '善于战略规划，目光长远', '内心坚定，不轻易被外界影响'],
    careers: ['架构师', '科学家', '投资分析师', '项目经理', '企业顾问'],
    match: 'ENFP（竞选者）或 ENTP（辩论家）'
  },
  INTP: {
    name: '逻辑学家', emoji: '🔬',
    desc: '充满好奇心的创新思考者，享受探索抽象理论和复杂问题。你的头脑总是充满各种有趣的想法。',
    traits: ['逻辑思维极强', '对知识有无限渴望', '善于发现问题的本质', '独立思考不随波逐流'],
    careers: ['程序员', '数据科学家', '哲学家', '数学家', '研究员'],
    match: 'ENTJ（指挥官）或 ENFJ（主人公）'
  },
  ENTJ: {
    name: '指挥官', emoji: '⚔️',
    desc: '天生的领导者，果断、高效、充满自信。你善于制定战略目标并带领团队去实现。',
    traits: ['决策果断有魄力', '天生的组织领导能力', '追求效率和结果', '善于激励和带动他人'],
    careers: ['CEO', '律师', '管理顾问', '企业家', '政治家'],
    match: 'INTP（逻辑学家）或 INFP（调停者）'
  },
  ENTP: {
    name: '辩论家', emoji: '💡',
    desc: '机智灵活的创新者，喜欢挑战传统观点。你思维敏捷，总能从不同角度看待问题。',
    traits: ['思维发散创意无限', '口才出众善于辩论', '适应力强不怕变化', '喜欢挑战和冒险'],
    careers: ['创业者', '产品经理', '记者', '营销总监', '演说家'],
    match: 'INTJ（建筑师）或 INFJ（提倡者）'
  },
  INFJ: {
    name: '提倡者', emoji: '🌟',
    desc: '温柔而坚定的理想主义者，内心有着强烈的使命感。你总是默默关心身边的人。',
    traits: ['直觉敏锐洞察力强', '理想主义追求意义', '善于倾听理解他人', '内心世界丰富深邃'],
    careers: ['心理咨询师', '作家', '教师', '社工', '人力资源'],
    match: 'ENTP（辩论家）或 ENFP（竞选者）'
  },
  INFP: {
    name: '调停者', emoji: '🎨',
    desc: '充满想象力的理想主义者，追求内心的和谐与真诚。你拥有丰富的情感世界和创造力。',
    traits: ['创造力丰富想象力强', '善良真诚关心他人', '追求内心的真实和谐', '有强烈的价值观信念'],
    careers: ['作家', '设计师', '心理治疗师', '音乐家', '社会活动家'],
    match: 'ENTJ（指挥官）或 ENFJ（主人公）'
  },
  ENFJ: {
    name: '主人公', emoji: '🎭',
    desc: '热情洋溢的领导者，天生善于理解和激励他人。你总是把他人的需求放在心上。',
    traits: ['魅力四射感染力强', '善于理解和鼓励他人', '有强烈的责任感', '天生的团队建设者'],
    careers: ['老师', '培训师', '公关经理', '非营利组织领导', '人力资源总监'],
    match: 'INTP（逻辑学家）或 INFP（调停者）'
  },
  ENFP: {
    name: '竞选者', emoji: '🎪',
    desc: '热情而富有创造力的自由灵魂，总是充满活力和好奇心。你是团队中的开心果。',
    traits: ['热情洋溢活力无限', '创意不断思维跳跃', '善于交际朋友众多', '乐观开朗感染他人'],
    careers: ['记者', '广告创意', '演员', '活动策划', '自由职业者'],
    match: 'INTJ（建筑师）或 INFJ（提倡者）'
  },
  ISTJ: {
    name: '物流师', emoji: '📋',
    desc: '踏实可靠的实干家，做事有条不紊、认真负责。你是团队中最让人放心的人。',
    traits: ['做事严谨有条理', '责任感强信守承诺', '注重细节追求准确', '踏实可靠值得信赖'],
    careers: ['会计师', '审计师', '军官', '工程师', '公务员'],
    match: 'ESFP（表演者）或 ESTP（企业家）'
  },
  ISFJ: {
    name: '守卫者', emoji: '🛡️',
    desc: '温暖忠诚的守护者，默默关心身边的每一个人。你总是把别人的需求放在自己前面。',
    traits: ['温柔体贴关怀他人', '忠诚可靠重视承诺', '细心周到注重细节', '低调内敛默默付出'],
    careers: ['护士', '教师', '行政助理', '社工', '图书管理员'],
    match: 'ESTP（企业家）或 ESFP（表演者）'
  },
  ESTJ: {
    name: '总经理', emoji: '👔',
    desc: '出色的管理者和组织者，做事雷厉风行、高效务实。你天生就是领导者的料。',
    traits: ['组织能力极强', '做事果断高效', '注重规则和秩序', '责任感强有担当'],
    careers: ['项目经理', '法官', '财务经理', '行政主管', '军事指挥官'],
    match: 'ISFP（探险家）或 ISTP（鉴赏家）'
  },
  ESFJ: {
    name: '执政官', emoji: '🤝',
    desc: '热心肠的社交达人，总是关心他人的需求和感受。你是朋友圈中的核心人物。',
    traits: ['热情友善善于社交', '关心他人乐于助人', '重视和谐的人际关系', '做事认真负责任'],
    careers: ['销售经理', '公关专员', '人力资源', '活动策划', '医护人员'],
    match: 'ISFP（探险家）或 ISTP（鉴赏家）'
  },
  ISTP: {
    name: '鉴赏家', emoji: '🔧',
    desc: '冷静务实的实验家，喜欢动手解决问题。你有着天生的机械直觉和冒险精神。',
    traits: ['动手能力极强', '冷静沉着应对变化', '独立自主不受约束', '善于分析和解决问题'],
    careers: ['工程师', '飞行员', '法医', '运动员', '消防员'],
    match: 'ESTJ（总经理）或 ESFJ（执政官）'
  },
  ISFP: {
    name: '探险家', emoji: '🌸',
    desc: '温柔而有艺术天赋的自由灵魂，善于发现生活中的美。你活在当下享受每一刻。',
    traits: ['艺术感知力强', '温柔体贴善解人意', '活在当下享受生活', '内心丰富但低调内敛'],
    careers: ['设计师', '摄影师', '厨师', '花艺师', '兽医'],
    match: 'ESTJ（总经理）或 ESFJ（执政官）'
  },
  ESTP: {
    name: '企业家', emoji: '🚀',
    desc: '精力充沛的行动派，喜欢冒险和挑战。你总是第一个行动、最后一个放弃。',
    traits: ['行动力超强', '适应力和应变能力强', '善于把握机会', '精力充沛不怕挑战'],
    careers: ['企业家', '运动员', '警察', '销售总监', '急救医师'],
    match: 'ISFJ（守卫者）或 ISTJ（物流师）'
  },
  ESFP: {
    name: '表演者', emoji: '🎉',
    desc: '天生的表演家和社交达人，总是充满欢乐和活力。你走到哪里都是焦点。',
    traits: ['乐观开朗热爱生活', '社交能力极强', '享受当下不虑将来', '善于调动气氛带动他人'],
    careers: ['演员', '主持人', '导游', '活动策划', '公关专员'],
    match: 'ISFJ（守卫者）或 ISTJ（物流师）'
  }
};

Page({
  onLoad: function() {
    analytics.trackPage('mbti');
    analytics.trackToolUse('mbti');
  },
  data: {
    questions,
    currentQ: 0,
    answers: [],
    showResult: false,
    result: '',
    resultInfo: {},
    showPoster: false,
    posterData: {},
    detailUnlocked: false
  },

  onAnswer(e) {
    const index = e.currentTarget.dataset.index;
    const { currentQ, answers } = this.data;
    const newAnswers = [...answers, index];

    if (currentQ < questions.length - 1) {
      this.setData({ currentQ: currentQ + 1, answers: newAnswers });
    } else {
      const result = this._calculate(newAnswers);
      this.setData({
        answers: newAnswers,
        showResult: true,
        result,
        resultInfo: mbtiData[result]
      });

      // 触发插屏广告
      const util = require('../../../utils/util');
      util.showInterstitialAd();
    }
  },

  _calculate(answers) {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questions.forEach((q, i) => {
      const dim = q.dimension;
      if (answers[i] === 0) {
        scores[dim[0]]++;
      } else {
        scores[dim[1]]++;
      }
    });

    return (
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P')
    );
  },

  onRestart() {
    this.setData({
      currentQ: 0,
      answers: [],
      showResult: false,
      result: '',
      resultInfo: {}
    });
  },

  onShare() {
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
  },

  onShareAppMessage() {
    var share = require('../../../utils/share');
    return share.buildShareConfig('mbti', {
      result: this.data.result,
      name: (this.data.resultInfo || {}).name || ''
    }, '/pages/test/mbti/index');
  },

  onShareTimeline() {
    var share = require('../../../utils/share');
    return share.buildTimelineConfig('mbti', {
      result: this.data.result,
      name: (this.data.resultInfo || {}).name || ''
    });
  },

  showPoster() {
    var info = this.data.resultInfo || {};
    this.setData({
      showPoster: true,
      posterData: {
        emoji: info.emoji || '🧠',
        title: 'MBTI 性格测试',
        subtitle: '我的性格类型是',
        result: this.data.result,
        highlight: info.name || '',
        desc: info.desc || '',
        qrTip: '扫一扫，你也来测测你是什么类型！'
      }
    });
  },

  closePoster() { this.setData({ showPoster: false }); },

  onUnlocked() { this.setData({ detailUnlocked: true }); }
});
