var analytics = require('../../../utils/analytics');
// pages/horoscope/match/index.js
var signs = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
var emojis = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// 星座元素
var elements = { 0:'火',1:'土',2:'风',3:'水',4:'火',5:'土',6:'风',7:'水',8:'火',9:'土',10:'风',11:'水' };
var elemColors = { '火':'#EF4444', '土':'#A16207', '风':'#0EA5E9', '水':'#6366F1' };

// 配对评分矩阵 (简化版本，对称矩阵)
var matchScores = [
//白 金 双 巨 狮 处 秤 蝎 射 摩 瓶 鱼
  [75,55,80,50,95,60,85,45,90,55,80,65], // 白羊
  [55,80,60,85,65,92,70,88,50,90,55,82], // 金牛
  [80,60,78,55,82,65,90,48,85,52,95,62], // 双子
  [50,85,55,80,58,88,52,92,45,85,60,95], // 巨蟹
  [95,65,82,58,78,62,88,55,92,52,80,48], // 狮子
  [60,92,65,88,62,76,68,90,55,95,58,85], // 处女
  [85,70,90,52,88,68,75,58,82,62,88,55], // 天秤
  [45,88,48,92,55,90,58,78,42,85,52,95], // 天蝎
  [90,50,85,45,92,55,82,42,76,48,88,52], // 射手
  [55,90,52,85,52,95,62,85,48,78,55,88], // 摩羯
  [80,55,95,60,80,58,88,52,88,55,75,62], // 水瓶
  [65,82,62,95,48,85,55,95,52,88,62,78]  // 双鱼
];

var matchDescs = {
  high: [
    '天生一对！你们的星座组合默契十足，相处起来自然融洽，是令人羡慕的组合。',
    '绝佳搭配！你们能互相欣赏对方的优点，感情基础非常牢固。',
    '天作之合！你们的性格互补，能给对方带来最需要的东西。'
  ],
  mid: [
    '需要磨合但很有潜力。你们各有优势，学会欣赏差异就能走得很远。',
    '有挑战但也有惊喜。你们的组合会带来成长，付出耐心会有回报。',
    '不同的视角碰撞出新的火花。你们需要多沟通，但感情会越来越深。'
  ],
  low: [
    '挑战较大，但并非不可能。真爱可以超越星座，关键是相互理解。',
    '需要更多努力来维系感情，但正因为难得，才更值得珍惜。',
    '性格差异明显，但差异也意味着互补。用爱和耐心去填补。'
  ]
};

function getMatchResult(s1, s2) {
  var score = matchScores[s1][s2];
  var elem1 = elements[s1], elem2 = elements[s2];
  var sameElem = elem1 === elem2;
  var level, desc;
  if (score >= 85) { level = 'high'; desc = matchDescs.high[Math.floor(Math.random() * 3)]; }
  else if (score >= 60) { level = 'mid'; desc = matchDescs.mid[Math.floor(Math.random() * 3)]; }
  else { level = 'low'; desc = matchDescs.low[Math.floor(Math.random() * 3)]; }

  return {
    score, level, desc, sameElem,
    elem1, elem2, elemColor1: elemColors[elem1], elemColor2: elemColors[elem2],
    love: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
    friendship: Math.min(100, score + Math.floor(Math.random() * 15) - 5),
    work: Math.min(100, score + Math.floor(Math.random() * 10)),
    tips: score >= 85 ? '珍惜这段缘分，继续保持良好的沟通。' :
          score >= 60 ? '多花时间了解对方，用耐心浇灌感情。' :
          '学会尊重差异，爱可以超越星座的限制。'
  };
}

Page({
  onLoad: function() {
    analytics.trackPage('match');
    analytics.startStay('match');
    analytics.trackToolUse('match');
  },
  data: {
    signs: signs.map(function(name, i) { return { name: name, emoji: emojis[i], index: i }; }),
    sign1: -1,
    sign2: -1,
    selecting: 1,
    showResult: false,
    result: null
  },

  selectSign: function(e) {
    var index = e.currentTarget.dataset.index;
    var selecting = this.data.selecting;
    if (selecting === 1) {
      this.setData({ sign1: index, selecting: 2 });
    } else {
      this.setData({ sign2: index, selecting: 0 });
      this.doMatch(this.data.sign1, index);
    }
  },

  doMatch: function(s1, s2) {
    var result = getMatchResult(s1, s2);
    this.setData({ showResult: true, result });
  },

  restart: function() {
    this.setData({ sign1: -1, sign2: -1, selecting: 1, showResult: false, result: null });
  },

  onHide: function() { analytics.endStay('match'); },


  onUnload: function() { analytics.endStay('match'); },



  onShareAppMessage: function() {
    var sign1 = this.data.sign1; var sign2 = this.data.sign2; var result = this.data.result;
    if (result) {
      return { title: signs[sign1] + ' ❤️ ' + signs[sign2] + ' 配对指数' + result.score + '%', path: '/pages/horoscope/match/index' };
    }
    return { title: '星座配对测试', path: '/pages/horoscope/match/index' };
  },

  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("horoscope-match", {});
  }
});