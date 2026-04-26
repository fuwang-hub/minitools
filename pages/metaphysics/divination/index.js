var analytics = require('../../../utils/analytics');
// pages/metaphysics/divination/index.js
var signPool = [
  { num: 1, type: '上上签', poem: '日出东方照四方，前途光明万里长', meaning: '诸事顺利，心想事成。无论是事业还是感情，都将迎来好的转机。', advice: '把握当下机会，大胆行动。' },
  { num: 2, type: '上吉签', poem: '春风得意马蹄疾，一朝看尽长安花', meaning: '运势旺盛，有贵人相助。近期做事会事半功倍。', advice: '积极进取，但不要骄傲自满。' },
  { num: 3, type: '上吉签', poem: '云开见月明如镜，渐觉天机报好音', meaning: '困境即将过去，光明就在前方。坚持下去会有好结果。', advice: '保持耐心，好运将至。' },
  { num: 4, type: '中吉签', poem: '流水落花春去也，天上人间两相宜', meaning: '运势平稳中有小惊喜，顺其自然为佳。', advice: '不必强求，随缘而行。' },
  { num: 5, type: '中吉签', poem: '一帆风顺行千里，半点浮云遮不住', meaning: '前进道路上会有小波折，但总体顺利。', advice: '遇到困难不要慌，稳步前进。' },
  { num: 6, type: '中签', poem: '花开花落自有时，不必忧愁不必悲', meaning: '运势平平，适合韬光养晦，积蓄力量。', advice: '修身养性，等待时机。' },
  { num: 7, type: '中签', poem: '守得云开见月明，静待花开缘自来', meaning: '需要耐心等待，急躁反而坏事。', advice: '沉住气，好事多磨。' },
  { num: 8, type: '中签', poem: '山高路远行人少，莫畏前程多艰难', meaning: '虽然道路曲折，但只要坚持就能到达。', advice: '脚踏实地，一步一个脚印。' },
  { num: 9, type: '中下签', poem: '月缺花残各自伤，莫将愁绪锁心房', meaning: '近期可能有些不顺，需要调整心态。', advice: '保持乐观，困难是暂时的。' },
  { num: 10, type: '下签', poem: '风雨飘摇路难行，且将苦楚化甘甜', meaning: '运势低迷期，但苦尽甘来。', advice: '低调行事，避免冲动决策。等待时机转好。' }
];

function getTypeColor(type) {
  if (type.indexOf('上') >= 0) return '#059669';
  if (type.indexOf('下') >= 0) return '#dc2626';
  return '#b45309';
}

Page({
  onLoad: function() {
    analytics.trackPage('divination');
    analytics.startStay('divination');
    analytics.trackToolUse('divination');
  },
  data: {
    phase: 'ready',
    shakeCount: 0,
    result: null,
    history: []
  },

  startShake: function() {
    this.setData({ phase: 'shaking', shakeCount: 0 });
    this._doShake(0);
  },

  _doShake: function(count) {
    var that = this;
    if (count >= 6) {
      var idx = Math.floor(Math.random() * signPool.length);
      var sign = signPool[idx];
      var result = {
        num: sign.num,
        type: sign.type,
        typeColor: getTypeColor(sign.type),
        poem: sign.poem,
        meaning: sign.meaning,
        advice: sign.advice
      };
      var historyItem = { num: sign.num, type: sign.type, typeColor: getTypeColor(sign.type), time: that._now() };
      var history = [historyItem].concat(that.data.history).slice(0, 10);
      setTimeout(function() {
        that.setData({ phase: 'result', result: result, history: history });
      }, 500);
      return;
    }
    this.setData({ shakeCount: count + 1 });
    var that = this;
    setTimeout(function() { that._doShake(count + 1); }, 300);
  },

  _now: function() {
    var d = new Date();
    return (d.getMonth()+1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  },

  restart: function() {
    this.setData({ phase: 'ready', result: null });
  },

  onHide: function() { analytics.endStay('divination'); },


  onUnload: function() { analytics.endStay('divination'); },



  onShareAppMessage: function() {
    analytics.trackShare('friend', 'divination');
    var result = this.data.result;
    if (result) return { title: '我求到了' + result.type + '，你也来试试！', path: '/pages/metaphysics/divination/index' };
    return { title: '求签问卦 - 探索命运的指引', path: '/pages/metaphysics/divination/index' };
  },

  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("divination", {});
  }
});