// pages/horoscope/chart/index.js
const signs = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
const emojis = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const planets = [
  { name: '太阳', emoji: '☀️', meaning: '自我、意志、生命力' },
  { name: '月亮', emoji: '🌙', meaning: '情感、直觉、内心需求' },
  { name: '水星', emoji: '💫', meaning: '思维、沟通、学习' },
  { name: '金星', emoji: '💕', meaning: '爱情、美感、价值观' },
  { name: '火星', emoji: '🔥', meaning: '行动力、欲望、勇气' },
  { name: '木星', emoji: '🌟', meaning: '幸运、成长、信仰' },
  { name: '土星', emoji: '💎', meaning: '责任、限制、成熟' },
  { name: '上升', emoji: '⬆️', meaning: '外在表现、第一印象' }
];

function getSignFromDate(month, day) {
  const ranges = [[1,20,9],[2,19,10],[3,21,11],[4,20,0],[5,21,1],[6,21,2],[7,23,3],[8,23,4],[9,23,5],[10,23,6],[11,22,7],[12,22,8]];
  for (let i = 0; i < ranges.length; i++) {
    const [m, d, s] = ranges[i];
    if (month === m && day <= d) return s;
    if (month === m && day > d) return (s + 1) % 12;
  }
  return 0;
}

function pseudoRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateChart(year, month, day, hour) {
  const sunSign = getSignFromDate(month, day);
  const seed = year * 10000 + month * 100 + day;

  const chart = planets.map((p, i) => {
    let signIdx;
    if (i === 0) signIdx = sunSign;
    else if (i === 7) signIdx = (sunSign + Math.floor(hour / 2) + 3) % 12; // 上升
    else signIdx = Math.floor(pseudoRandom(seed + i * 137) * 12);
    const degree = Math.floor(pseudoRandom(seed + i * 251) * 30);
    return {
      ...p,
      sign: signs[signIdx],
      signEmoji: emojis[signIdx],
      signIdx,
      degree
    };
  });

  // 元素分析
  const elemCount = { '火': 0, '土': 0, '风': 0, '水': 0 };
  const elemMap = { 0:'火',1:'土',2:'风',3:'水',4:'火',5:'土',6:'风',7:'水',8:'火',9:'土',10:'风',11:'水' };
  chart.forEach(p => { elemCount[elemMap[p.signIdx]]++; });

  const dominantElem = Object.entries(elemCount).sort((a,b) => b[1] - a[1])[0][0];
  const elemDescs = {
    '火': '你的星盘以火象能量为主，说明你热情积极、充满行动力，有着强烈的自我表达欲望。',
    '土': '你的星盘以土象能量为主，说明你务实稳重、注重物质安全，做事踏实有耐心。',
    '风': '你的星盘以风象能量为主，说明你善于思考和沟通，社交能力强，喜欢新鲜事物。',
    '水': '你的星盘以水象能量为主，说明你感受力强、直觉敏锐，情感丰富有同理心。'
  };

  return {
    chart,
    sunSign: signs[sunSign],
    sunEmoji: emojis[sunSign],
    moonSign: chart[1].sign,
    risingSign: chart[7].sign,
    dominantElem,
    elemCount,
    elemDesc: elemDescs[dominantElem],
    summary: '你的太阳星座是' + signs[sunSign] + '，月亮星座是' + chart[1].sign + '，上升星座是' + chart[7].sign + '。这意味着你外在展现' + chart[7].sign + '的特质，内在是' + signs[sunSign] + '的本质，情感世界则是' + chart[1].sign + '的模式。'
  };
}

Page({
  data: {
    birthYear: '1995',
    birthMonth: '6',
    birthDay: '15',
    birthHour: '12',
    showResult: false,
    result: null,
    years: Array.from({length: 60}, (_, i) => '' + (1965 + i)),
    months: Array.from({length: 12}, (_, i) => '' + (i + 1)),
    days: Array.from({length: 31}, (_, i) => '' + (i + 1)),
    hours: Array.from({length: 24}, (_, i) => '' + i),
    yearIdx: 30, monthIdx: 5, dayIdx: 14, hourIdx: 12
  },

  onYearChange(e) { this.setData({ yearIdx: e.detail.value, birthYear: this.data.years[e.detail.value] }); },
  onMonthChange(e) { this.setData({ monthIdx: e.detail.value, birthMonth: this.data.months[e.detail.value] }); },
  onDayChange(e) { this.setData({ dayIdx: e.detail.value, birthDay: this.data.days[e.detail.value] }); },
  onHourChange(e) { this.setData({ hourIdx: e.detail.value, birthHour: this.data.hours[e.detail.value] }); },

  generate() {
    const { birthYear, birthMonth, birthDay, birthHour } = this.data;
    const result = generateChart(parseInt(birthYear), parseInt(birthMonth), parseInt(birthDay), parseInt(birthHour));
    this.setData({ showResult: true, result });
  },

  restart() {
    this.setData({ showResult: false, result: null });
  },

  onShareAppMessage() {
    return { title: '我的星盘分析，来看看你的！', path: '/pages/horoscope/chart/index' };
  }
,
  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("default", {});
  }
});