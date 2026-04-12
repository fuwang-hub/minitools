// pages/horoscope/weekly/index.js
var signs = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
var signEmojis = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

function getWeekRange() {
  var now = new Date();
  var day = now.getDay() || 7;
  var mon = new Date(now); mon.setDate(now.getDate() - day + 1);
  var sun = new Date(now); sun.setDate(now.getDate() - day + 7);
  var fmt = function(d) { return (d.getMonth()+1) + '.' + d.getDate(); };
  return fmt(mon) + ' - ' + fmt(sun);
}

function pseudoRandom(seed) {
  var x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function starsStr(n) {
  var s = '';
  for (var i = 0; i < n; i++) s += '⭐';
  return s;
}

function genWeekly(signIdx) {
  var now = new Date();
  var weekNum = Math.floor(now.getTime() / (7*86400000));
  var seed = weekNum * 100 + signIdx;

  var r = function(offset) { return pseudoRandom(seed + offset); };
  var starCount = function(offset) { return Math.max(2, Math.min(5, Math.round(r(offset) * 4) + 1)); };

  var days = ['周一','周二','周三','周四','周五','周六','周日'];
  var luckyDay = days[Math.floor(r(1) * 7)];
  var luckyNums = [Math.floor(r(2)*9)+1, Math.floor(r(3)*9)+1, Math.floor(r(4)*9)+1];

  var loveDescs = [
    '本周感情运势不错，单身者有机会遇到心仪的人。已有伴侣的感情升温，适合安排浪漫约会。',
    '感情方面需要多一些耐心，不要因为小事产生争执。单身者不急，缘分会在不经意间到来。',
    '桃花运旺盛的一周！多参加社交活动，会有意想不到的收获。已有伴侣记得多表达爱意。',
    '本周适合反思感情关系，有些问题需要坦诚沟通。单身者可以趁机明确自己的择偶标准。',
    '感情甜蜜指数爆表！无论单身还是有伴，都能感受到满满的幸福和温暖。'
  ];
  var careerDescs = [
    '工作上会有新的挑战和机遇，保持积极态度。团队协作是本周的关键，多与同事沟通。',
    '本周工作效率提升，之前搁置的项目有望取得突破。注意文件和数据的准确性。',
    '事业运势平稳，适合做长期规划。可能会收到新的合作提案，仔细评估后再做决定。',
    '职场中可能遇到一些阻碍，但这些都是暂时的。保持冷静，用实力说话。',
    '创意和灵感爆发的一周！适合提出新方案，展示自己的才华。领导会注意到你的努力。'
  ];
  var financeDescs = [
    '财运不错，但要避免冲动消费。适合做一些稳健的理财规划，守住钱袋子。',
    '收入有望增加，可能有意外之财。但同时也要注意控制不必要的开支。',
    '本周财运平稳，不适合大额投资。专注于本职工作带来的稳定收入更靠谱。',
    '有贵人相助，可能带来不错的财运机会。但切记不要贪心，见好就收。',
    '财务方面需要更加谨慎，避免借贷和担保。把精力放在开源而非投机上。'
  ];
  var healthDescs = [
    '身体状况良好，适合加强运动锻炼。注意作息规律，不要熬夜太晚。',
    '注意饮食健康，减少外卖和油腻食物。多喝水，适当补充维生素。',
    '精力充沛的一周！适合尝试新的运动方式，比如瑜伽或游泳。',
    '有些疲惫感，需要适当休息。周末安排一次短途旅行或户外活动会很好。',
    '健康方面整体不错，但要注意眼部疲劳。减少屏幕使用时间，多看远处放松。'
  ];

  var overall = starCount(50);
  var loveStars = starCount(10);
  var careerStars = starCount(20);
  var financeStars = starCount(30);
  var healthStars = starCount(40);

  return {
    loveStars: starsStr(loveStars),
    loveDesc: loveDescs[Math.floor(r(10) * loveDescs.length)],
    careerStars: starsStr(careerStars),
    careerDesc: careerDescs[Math.floor(r(20) * careerDescs.length)],
    financeStars: starsStr(financeStars),
    financeDesc: financeDescs[Math.floor(r(30) * financeDescs.length)],
    healthStars: starsStr(healthStars),
    healthDesc: healthDescs[Math.floor(r(40) * healthDescs.length)],
    luckyDay: luckyDay,
    luckyNums: luckyNums.join(', '),
    overallStars: starsStr(overall),
    summary: '本周整体运势' + (overall >= 4 ? '不错' : overall >= 3 ? '平稳' : '需要多加注意') + '，把握好' + luckyDay + '这个幸运日，会有意想不到的好事发生。'
  };
}

Page({
  data: {
    signs: signs.map(function(name, i) { return { name: name, emoji: signEmojis[i], index: i }; }),
    selectedSign: -1,
    weekRange: '',
    result: null
  },

  onLoad: function() {
    this.setData({ weekRange: getWeekRange() });
  },

  selectSign: function(e) {
    var index = e.currentTarget.dataset.index;
    if (index < 0) {
      this.setData({ selectedSign: -1, result: null });
      return;
    }
    var result = genWeekly(index);
    this.setData({ selectedSign: index, result: result });
  },

  onShareAppMessage: function() {
    var selectedSign = this.data.selectedSign;
    if (selectedSign >= 0) {
      return { title: signs[selectedSign] + '本周运势，快来看看！', path: '/pages/horoscope/weekly/index' };
    }
    return { title: '本周星座运势查询', path: '/pages/horoscope/weekly/index' };
  }
,
  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("daily", {});
  }
});