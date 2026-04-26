var analytics = require('../../../utils/analytics');

// ========== 农历数据 ==========
// 1900-2100年农历数据（压缩格式：每年用一个十六进制数表示）
var LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252,
  0x0d520
];

var LUNAR_MONTHS = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
var LUNAR_DAYS = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
var TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var SHENG_XIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
var WEEK_NAMES = ['日','一','二','三','四','五','六'];

// 公历节日
var SOLAR_FESTIVALS = {
  '1-1': '元旦', '2-14': '情人节', '3-8': '妇女节', '3-12': '植树节',
  '4-1': '愚人节', '5-1': '劳动节', '5-4': '青年节', '6-1': '儿童节',
  '7-1': '建党节', '8-1': '建军节', '9-10': '教师节', '10-1': '国庆节',
  '10-31': '万圣夜', '11-11': '双十一', '12-24': '平安夜', '12-25': '圣诞节'
};

// 农历节日
var LUNAR_FESTIVALS = {
  '1-1': '春节', '1-15': '元宵节', '5-5': '端午节',
  '7-7': '七夕', '7-15': '中元节', '8-15': '中秋节',
  '9-9': '重阳节', '12-8': '腊八节', '12-30': '除夕'
};

// 24节气（简化版：根据月日近似）
var SOLAR_TERMS = {
  '2-4': '立春', '2-19': '雨水', '3-6': '惊蛰', '3-21': '春分',
  '4-5': '清明', '4-20': '谷雨', '5-6': '立夏', '5-21': '小满',
  '6-6': '芒种', '6-21': '夏至', '7-7': '小暑', '7-23': '大暑',
  '8-7': '立秋', '8-23': '处暑', '9-8': '白露', '9-23': '秋分',
  '10-8': '寒露', '10-23': '霜降', '11-7': '立冬', '11-22': '小雪',
  '12-7': '大雪', '12-22': '冬至', '1-6': '小寒', '1-20': '大寒'
};

// ========== 农历计算函数 ==========
function lunarYearDays(y) {
  var i, sum = 348;
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y) { return LUNAR_INFO[y - 1900] & 0xf; }

function leapDays(y) {
  if (leapMonth(y)) {
    return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(y, m) {
  return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

function solarToLunar(year, month, day) {
  var baseDate = new Date(1900, 0, 31);
  var objDate = new Date(year, month - 1, day);
  var offset = Math.floor((objDate - baseDate) / 86400000);

  var lunarYear, lunarMonth, lunarDay, isLeap = false;
  var temp = 0;

  for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
    temp = lunarYearDays(lunarYear);
    offset -= temp;
  }
  if (offset < 0) { offset += temp; lunarYear--; }

  var leap = leapMonth(lunarYear);
  isLeap = false;

  for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
    if (leap > 0 && lunarMonth === (leap + 1) && !isLeap) {
      --lunarMonth;
      isLeap = true;
      temp = leapDays(lunarYear);
    } else {
      temp = monthDays(lunarYear, lunarMonth);
    }
    if (isLeap && lunarMonth === (leap + 1)) isLeap = false;
    offset -= temp;
  }

  if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
    if (isLeap) { isLeap = false; } else { isLeap = true; --lunarMonth; }
  }
  if (offset < 0) { offset += temp; --lunarMonth; }

  lunarDay = offset + 1;

  var ganIdx = (lunarYear - 4) % 10;
  var zhiIdx = (lunarYear - 4) % 12;

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap: isLeap,
    monthStr: (isLeap ? '闰' : '') + LUNAR_MONTHS[lunarMonth - 1],
    dayStr: LUNAR_DAYS[lunarDay - 1],
    ganZhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
    shengXiao: SHENG_XIAO[zhiIdx]
  };
}

// ========== 页面逻辑 ==========
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

function buildCalendarDays(year, month) {
  var daysInMonth = getDaysInMonth(year, month);
  var firstDay = getFirstDayOfWeek(year, month);
  var today = new Date();
  var todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var days = [];

  // 填充前面的空位
  for (var i = 0; i < firstDay; i++) {
    days.push({ day: '', empty: true });
  }

  // 填充日期
  for (var d = 1; d <= daysInMonth; d++) {
    var lunar = solarToLunar(year, month, d);
    var solarKey = month + '-' + d;
    var lunarKey = lunar.month + '-' + lunar.day;
    var festival = SOLAR_FESTIVALS[solarKey] || LUNAR_FESTIVALS[lunarKey] || SOLAR_TERMS[solarKey] || '';
    var isToday = (year + '-' + month + '-' + d) === todayStr;
    var isWeekend = ((firstDay + d - 1) % 7 === 0 || (firstDay + d - 1) % 7 === 6);

    days.push({
      day: d,
      empty: false,
      lunar: festival || lunar.dayStr,
      lunarFull: lunar.monthStr + lunar.dayStr,
      festival: festival,
      isFestival: !!festival,
      isToday: isToday,
      isWeekend: isWeekend
    });
  }

  return days;
}

Page({
  onLoad: function() {
    analytics.trackPage('calendar');
    analytics.startStay('calendar');
    analytics.trackToolUse('calendar');
    var now = new Date();
    this._goToMonth(now.getFullYear(), now.getMonth() + 1);
  },

  data: {
    year: 2026,
    month: 4,
    monthStr: '',
    weekNames: WEEK_NAMES,
    days: [],
    selectedDay: null,
    selectedLunar: null,
    selectedFestivals: [],
    lunarYear: '',
    lunarGanZhi: '',
    lunarShengXiao: ''
  },

  _goToMonth: function(year, month) {
    if (month < 1) { year--; month = 12; }
    if (month > 12) { year++; month = 1; }

    var days = buildCalendarDays(year, month);
    var lunar = solarToLunar(year, month, 1);

    this.setData({
      year: year,
      month: month,
      monthStr: year + '年' + month + '月',
      days: days,
      lunarYear: lunar.ganZhi + '年',
      lunarGanZhi: lunar.ganZhi,
      lunarShengXiao: lunar.shengXiao,
      selectedDay: null,
      selectedLunar: null,
      selectedFestivals: []
    });

    // 默认选中今天（如果在当前月）
    var now = new Date();
    if (year === now.getFullYear() && month === now.getMonth() + 1) {
      this._selectDay(now.getDate());
    }
  },

  _selectDay: function(day) {
    var lunar = solarToLunar(this.data.year, this.data.month, day);
    var solarKey = this.data.month + '-' + day;
    var lunarKey = lunar.month + '-' + lunar.day;
    var festivals = [];
    if (SOLAR_FESTIVALS[solarKey]) festivals.push({ name: SOLAR_FESTIVALS[solarKey], type: 'solar' });
    if (LUNAR_FESTIVALS[lunarKey]) festivals.push({ name: LUNAR_FESTIVALS[lunarKey], type: 'lunar' });
    if (SOLAR_TERMS[solarKey]) festivals.push({ name: SOLAR_TERMS[solarKey], type: 'term' });

    var weekday = new Date(this.data.year, this.data.month - 1, day).getDay();

    this.setData({
      selectedDay: {
        year: this.data.year,
        month: this.data.month,
        day: day,
        weekday: '星期' + WEEK_NAMES[weekday]
      },
      selectedLunar: {
        monthStr: lunar.monthStr,
        dayStr: lunar.dayStr,
        ganZhi: lunar.ganZhi + '年',
        shengXiao: lunar.shengXiao
      },
      selectedFestivals: festivals
    });
  },

  prevMonth: function() {
    this._goToMonth(this.data.year, this.data.month - 1);
  },

  nextMonth: function() {
    this._goToMonth(this.data.year, this.data.month + 1);
  },

  goToday: function() {
    var now = new Date();
    this._goToMonth(now.getFullYear(), now.getMonth() + 1);
  },

  onDayTap: function(e) {
    var day = e.currentTarget.dataset.day;
    if (!day) return;
    this._selectDay(day);
  },

  onHide: function() { analytics.endStay('calendar'); },


  onUnload: function() { analytics.endStay('calendar'); },



  onShareAppMessage: function() {
    return {
      title: '万年历 - 农历公历对照查询',
      path: '/pages/tools/calendar/index'
    };
  }
});
