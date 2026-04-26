var analytics = require('../../../utils/analytics');
// pages/metaphysics/name/index.js
function getStrokes(char) {
  var code = char.charCodeAt(0);
  // 简化的笔画算法，基于Unicode编码范围估算
  if (code >= 0x4e00 && code <= 0x9fff) {
    return ((code - 0x4e00) % 20) + 3;
  }
  return code % 15 + 2;
}

function calcFiveGrid(surname, givenName) {
  var s1 = surname.split('').reduce(function(sum, c) { return sum + getStrokes(c); }, 0)
  var g1 = givenName.charAt(0) ? getStrokes(givenName.charAt(0)) : 0;
  var g2 = givenName.length > 1 ? getStrokes(givenName.charAt(1)) : 0;

  return {
    tianGe: s1 + 1,            // 天格
    renGe: s1 + g1,            // 人格
    diGe: g1 + g2 + 1,        // 地格
    waiGe: s1 + g2 + 1,       // 外格
    zongGe: s1 + g1 + g2      // 总格
  };
}

function getGeLuck(ge) {
  var n = ge % 10;
  if ([1,3,5,6,7,8].includes(n)) return { luck: '吉', color: '#059669' };
  if ([2,4].includes(n)) return { luck: '半吉', color: '#F59E0B' };
  return { luck: '凶', color: '#EF4444' };
}

var wuxing = ['金','木','水','火','土'];

function analyzeHanzi(name) {
  var total = name.split('').reduce(function(s, c) { return s + c.charCodeAt(0); }, 0)
  return wuxing[total % 5];
}

Page({
  onLoad: function() {
    analytics.trackPage('name');
    analytics.startStay('name');
    analytics.trackToolUse('name');
  },
  data: {
    surname: '',
    givenName: '',
    showResult: false,
    result: null
  },

  onSurnameInput: function(e) { this.setData({ surname: e.detail.value }); },
  onGivenInput: function(e) { this.setData({ givenName: e.detail.value }); },

  analyze: function() {
    var surname = this.data.surname; var givenName = this.data.givenName;
    if (!surname || !givenName) {
      wx.showToast({ title: '请输入完整姓名', icon: 'none' }); return;
    }
    var fullName = surname + givenName;
    var grid = calcFiveGrid(surname, givenName);
    var gridItems = [
      { name: '天格', value: grid.tianGe, luck: getGeLuck(grid.tianGe).luck, color: getGeLuck(grid.tianGe).color, desc: '代表先天运势，影响前半生' },
      { name: '人格', value: grid.renGe, luck: getGeLuck(grid.renGe).luck, color: getGeLuck(grid.renGe).color, desc: '代表主运，影响一生命运核心' },
      { name: '地格', value: grid.diGe, luck: getGeLuck(grid.diGe).luck, color: getGeLuck(grid.diGe).color, desc: '代表前运，影响36岁前运势' },
      { name: '外格', value: grid.waiGe, luck: getGeLuck(grid.waiGe).luck, color: getGeLuck(grid.waiGe).color, desc: '代表副运，影响社交和外部环境' },
      { name: '总格', value: grid.zongGe, luck: getGeLuck(grid.zongGe).luck, color: getGeLuck(grid.zongGe).color, desc: '代表后运，影响36岁后运势' }
    ];

    var jiCount = gridItems.filter(function(g) { return g.luck === '吉'; }).length;
    var totalScore = Math.min(99, 60 + jiCount * 8 + (fullName.length === 3 ? 3 : 0));
    var nameWuxing = analyzeHanzi(fullName);

    var personalityTraits = [
      '性格温和', '做事稳重', '思维敏捷', '心地善良', '意志坚定',
      '富有创意', '善于社交', '独立自主', '乐观开朗', '细心谨慎'
    ];
    var seed = fullName.split('').reduce(function(s, c) { return s + c.charCodeAt(0); }, 0)
    var traits = [
      personalityTraits[seed % 10],
      personalityTraits[(seed + 3) % 10],
      personalityTraits[(seed + 7) % 10]
    ];

    var careerAdvice = totalScore >= 85 ? '事业运势极佳，适合自主创业或担任领导角色。' :
                         totalScore >= 70 ? '事业发展稳定，在团队中能发挥重要作用。' :
                         '事业方面需要多努力，脚踏实地才能有所成就。';
    var loveAdvice = totalScore >= 85 ? '感情方面桃花旺盛，有望遇到理想伴侣。' :
                       totalScore >= 70 ? '感情运势不错，用心经营会收获幸福。' :
                       '感情方面需要多一些耐心，缘分自会到来。';

    this.setData({
      showResult: true,
      result: {
        fullName, surname, givenName,
        totalScore,
        gridItems,
        nameWuxing,
        traits,
        careerAdvice,
        loveAdvice,
        level: totalScore >= 90 ? '极佳' : totalScore >= 80 ? '优秀' : totalScore >= 70 ? '良好' : totalScore >= 60 ? '一般' : '偏弱'
      }
    });
  },

  restart: function() {
    this.setData({ surname: '', givenName: '', showResult: false, result: null });
  },

  onHide: function() { analytics.endStay('name'); },


  onUnload: function() { analytics.endStay('name'); },



  onShareAppMessage: function() {
    var result = this.data.result;
    if (result) return { title: '我的名字评分' + result.totalScore + '分，来测测你的！', path: '/pages/metaphysics/name/index' };
    return { title: '姓名测试打分', path: '/pages/metaphysics/name/index' };
  },

  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("name-test", {});
  }
});