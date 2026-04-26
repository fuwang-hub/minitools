var analytics = require('../../../utils/analytics');
// pages/metaphysics/zodiac-match/index.js
const zodiacList = [
  { name: '鼠', emoji: '🐭', year: '1996, 2008, 2020' },
  { name: '牛', emoji: '🐮', year: '1997, 2009, 2021' },
  { name: '虎', emoji: '🐯', year: '1998, 2010, 2022' },
  { name: '兔', emoji: '🐰', year: '1999, 2011, 2023' },
  { name: '龙', emoji: '🐲', year: '2000, 2012, 2024' },
  { name: '蛇', emoji: '🐍', year: '2001, 2013, 2025' },
  { name: '马', emoji: '🐴', year: '2002, 2014, 2026' },
  { name: '羊', emoji: '🐑', year: '2003, 2015, 2027' },
  { name: '猴', emoji: '🐵', year: '2004, 2016, 2028' },
  { name: '鸡', emoji: '🐔', year: '2005, 2017, 2029' },
  { name: '狗', emoji: '🐕', year: '2006, 2018, 2030' },
  { name: '猪', emoji: '🐷', year: '2007, 2019, 2031' }
];

// 六合
const liuHe = { 0:1, 1:0, 2:11, 11:2, 3:10, 10:3, 4:9, 9:4, 5:8, 8:5, 6:7, 7:6 };
// 三合
const sanHe = { 0:[0,4,8], 1:[1,5,9], 2:[2,6,10], 3:[3,7,11] };
// 六冲
const liuChong = { 0:6, 6:0, 1:7, 7:1, 2:8, 8:2, 3:9, 9:3, 4:10, 10:4, 5:11, 11:5 };

function getMatch(z1, z2) {
  if (z1 === z2) return { score: 75, level: '中吉', desc: '同属相的两个人有很多共同点，容易相互理解。但也可能因为太相似而缺少互补性。需要各自保持独立空间。' };
  if (liuHe[z1] === z2) return { score: 95, level: '上上', desc: '六合关系！这是最佳的属相配对之一。你们天生互相吸引，心灵相通，默契十足，是天作之合的组合。' };
  for (let g = 0; g < 4; g++) {
    const group = sanHe[g];
    if (group.includes(z1) && group.includes(z2)) return { score: 88, level: '上吉', desc: '三合关系！你们有着天然的吸引力和默契。在一起做事顺利，感情和睦，是非常好的搭配。' };
  }
  if (liuChong[z1] === z2) return { score: 40, level: '相冲', desc: '六冲关系，性格差异较大，相处需要更多包容和理解。但正因为差异，也可能产生强烈的吸引力。真爱可以超越一切。' };
  const diff = Math.abs(z1 - z2);
  if (diff === 3 || diff === 9) return { score: 50, level: '相刑', desc: '相刑关系，可能在某些方面存在摩擦。但只要双方愿意沟通和妥协，完全可以和谐相处。' };
  return { score: 70, level: '中吉', desc: '你们的属相搭配整体不错，虽然不是最佳组合，但通过相互理解和包容，可以建立美好的关系。' };
}

Page({
  onLoad: function() {
    analytics.trackPage('zodiac-match');
    analytics.trackToolUse('zodiac-match');
  },
  data: {
    zodiacList,
    z1: -1, z2: -1,
    selecting: 1,
    showResult: false,
    result: null
  },

  selectZodiac(e) {
    const { index } = e.currentTarget.dataset;
    if (this.data.selecting === 1) {
      this.setData({ z1: index, selecting: 2 });
    } else {
      this.setData({ z2: index, selecting: 0 });
      const match = getMatch(this.data.z1, index);
      this.setData({ showResult: true, result: match });
    }
  },

  restart() { this.setData({ z1: -1, z2: -1, selecting: 1, showResult: false, result: null }); },

  onShareAppMessage() {
    const { z1, z2, result } = this.data;
    if (result) return { title: zodiacList[z1].emoji + zodiacList[z1].name + ' ❤️ ' + zodiacList[z2].emoji + zodiacList[z2].name + ' 配对' + result.score + '分', path: '/pages/metaphysics/zodiac-match/index' };
    return { title: '属相配对测试', path: '/pages/metaphysics/zodiac-match/index' };
  }
,
  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("zodiac-match", {});
  }
});