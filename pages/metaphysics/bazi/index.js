var analytics = require('../../../utils/analytics');
// pages/metaphysics/bazi/index.js
var tianGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var diZhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var wuxingGan = ['木','木','火','火','土','土','金','金','水','水'];
var wuxingZhi = ['水','土','木','木','土','火','火','土','金','金','土','水'];
var shengXiao = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

function calcGanZhi(year, month, day, hour) {
  // 年柱
  var yearGan = (year - 4) % 10;
  var yearZhi = (year - 4) % 12;
  // 月柱（简化）
  var monthGan = (year * 12 + month + 3) % 10;
  var monthZhi = (month + 1) % 12;
  // 日柱（简化算法）
  var dayNum = Math.floor((new Date(year, month - 1, day).getTime()) / 86400000);
  var dayGan = (dayNum + 9) % 10;
  var dayZhi = (dayNum + 1) % 12;
  // 时柱
  var hourZhi = Math.floor((hour + 1) / 2) % 12;
  var hourGan = (dayGan * 2 + hourZhi) % 10;

  return {
    year: { gan: yearGan, zhi: yearZhi, text: tianGan[yearGan] + diZhi[yearZhi], wuxing: wuxingGan[yearGan] + wuxingZhi[yearZhi] },
    month: { gan: monthGan, zhi: monthZhi, text: tianGan[monthGan] + diZhi[monthZhi], wuxing: wuxingGan[monthGan] + wuxingZhi[monthZhi] },
    day: { gan: dayGan, zhi: dayZhi, text: tianGan[dayGan] + diZhi[dayZhi], wuxing: wuxingGan[dayGan] + wuxingZhi[dayZhi] },
    hour: { gan: hourGan, zhi: hourZhi, text: tianGan[hourGan] + diZhi[hourZhi], wuxing: wuxingGan[hourGan] + wuxingZhi[hourZhi] },
    shengxiao: shengXiao[yearZhi]
  };
}

function analyzeWuxing(bazi) {
  var count = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  [bazi.year, bazi.month, bazi.day, bazi.hour].forEach(function(p) {
    count[wuxingGan[p.gan]]++;
    count[wuxingZhi[p.zhi]]++;
  });
  var sorted = Object.keys(count).map(function(k) { return [k, count[k]]; }).sort(function(a, b) { return b[1] - a[1]; });
  var strongest = sorted[0][0];
  var weakest = sorted[sorted.length - 1][0];
  var missing = []; sorted.forEach(function(item) { if (item[1] === 0) missing.push(item[0]); });

  return { count, strongest, weakest, missing, sorted };
}

var wuxingDescs = {
  '金': '性格坚毅果断，做事有条理，重义气讲信用。',
  '木': '性格仁慈正直，富有同情心，追求成长和发展。',
  '水': '性格聪慧灵活，善于变通，有很强的适应能力。',
  '火': '性格热情开朗，积极进取，有强烈的表现欲。',
  '土': '性格稳重厚道，为人忠诚，有很强的包容力。'
};

Page({
  onLoad: function() {
    analytics.trackPage('bazi');
    analytics.startStay('bazi');
    analytics.trackToolUse('bazi');
  },
  data: {
    birthYear: '1995', birthMonth: '6', birthDay: '15', birthHour: '12',
    showResult: false, result: null,
    years: (function() { var a = []; for (var i = 0; i < 60; i++) a.push("" + (1965 + i)); return a; })(),
    months: (function(){var a=[];for(var i=1;i<=12;i++)a.push(""+i);return a;})(),
    days: (function(){var a=[];for(var i=1;i<=31;i++)a.push(""+i);return a;})(),
    hours: (function(){var a=[];for(var i=0;i<24;i++)a.push(""+i);return a;})(),
    yearIdx: 30, monthIdx: 5, dayIdx: 14, hourIdx: 12
  },

  onYearChange: function(e) { this.setData({ yearIdx: e.detail.value, birthYear: this.data.years[e.detail.value] }); },
  onMonthChange: function(e) { this.setData({ monthIdx: e.detail.value, birthMonth: this.data.months[e.detail.value] }); },
  onDayChange: function(e) { this.setData({ dayIdx: e.detail.value, birthDay: this.data.days[e.detail.value] }); },
  onHourChange: function(e) { this.setData({ hourIdx: e.detail.value, birthHour: this.data.hours[e.detail.value] }); },

  analyze: function() {
    var { birthYear, birthMonth, birthDay, birthHour } = this.data;
    var bazi = calcGanZhi(+birthYear, +birthMonth, +birthDay, +birthHour);
    var wuxing = analyzeWuxing(bazi);
    var dayMaster = tianGan[bazi.day.gan];
    var dayWuxing = wuxingGan[bazi.day.gan];

    this.setData({
      showResult: true,
      result: {
        bazi, wuxing, dayMaster, dayWuxing,
        personality: wuxingDescs[dayWuxing],
        advice: wuxing.missing.length > 0
          ? '你的八字中缺少' + wuxing.missing.join('、') + '，建议在日常生活中适当补充对应元素。'
          : '你的五行较为均衡，运势平稳发展。',
        colors: { '金': '#F59E0B', '木': '#059669', '水': '#3B82F6', '火': '#EF4444', '土': '#A16207' }
      }
    });
  },

  restart: function() { this.setData({ showResult: false, result: null }); },

  onHide: function() { analytics.endStay('bazi'); },


  onUnload: function() { analytics.endStay('bazi'); },



  onShareAppMessage: function() {
    return { title: '生辰八字分析', path: '/pages/metaphysics/bazi/index' };
  },

  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("bazi", {});
  }
});