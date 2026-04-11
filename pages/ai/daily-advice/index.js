// pages/ai/daily-advice/index.js
const yiPool = ['出行','约会','购物','学习','运动','社交','理财','创作','打扫','做饭','读书','散步','冥想','早起','写日记','见朋友','看电影','喝咖啡','逛公园','买花','听音乐','泡澡','拍照','发朋友圈','整理衣橱','学做菜','养植物'];
const jiPool = ['熬夜','争吵','冲动消费','暴饮暴食','拖延','负面情绪','八卦','抱怨','看恐怖片','借钱','赌气','翻旧账','过度加班','喝酒','赖床','说谎','攀比','焦虑','纠结','犹豫不决'];
const luckyItems = ['红色','数字7','向东','苹果','咖啡','蓝色','数字3','向南','橙子','奶茶','绿色','数字8','向西','香蕉','果汁','紫色','数字6','向北','草莓','牛奶'];
const moods = ['😊 开心','😌 平静','🤗 温暖','😎 自信','🥰 幸福','😇 感恩','🤔 思考','😴 慵懒'];
const quotes = [
  '生活不是等待暴风雨过去，而是学会在雨中跳舞。',
  '每一天都是一个新的开始，别让昨天的烦恼影响今天的好心情。',
  '你不需要很厉害才能开始，但你需要开始才能变得很厉害。',
  '把每一天当作生命中最好的一天来过。',
  '种一棵树最好的时间是十年前，其次是现在。',
  '与其羡慕别人的生活，不如经营好自己的日子。',
  '生活总会有不期而遇的温暖和生生不息的希望。',
  '今天的你比昨天更好，这就够了。',
  '做一个温暖的人，不卑不亢，清澈善良。',
  '人生没有白走的路，每一步都算数。'
];

function pseudoRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffle(arr, seed) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom(seed + i) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getToday() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), weekday: ['日','一','二','三','四','五','六'][d.getDay()] };
}

function getLunar(month, day) {
  const lunarMonths = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
  const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  const lm = ((month + 10) % 12);
  const ld = ((day + 14) % 30);
  return lunarMonths[lm] + lunarDays[ld];
}

Page({
  data: {
    today: null,
    lunar: '',
    yiList: [],
    jiList: [],
    luckyColor: '',
    luckyNum: '',
    luckyDir: '',
    mood: '',
    quote: '',
    overallScore: 0
  },

  onLoad() { this.generateDaily(); },
  onShow() { this.generateDaily(); },

  generateDaily() {
    const today = getToday();
    const seed = today.year * 10000 + today.month * 100 + today.day;

    const yi = shuffle(yiPool, seed).slice(0, 4);
    const ji = shuffle(jiPool, seed + 100).slice(0, 3);
    const lucky = shuffle(luckyItems, seed + 200);
    const mood = moods[Math.floor(pseudoRandom(seed + 300) * moods.length)];
    const quote = quotes[Math.floor(pseudoRandom(seed + 400) * quotes.length)];
    const score = Math.floor(pseudoRandom(seed + 500) * 30) + 70;

    this.setData({
      today,
      lunar: getLunar(today.month, today.day),
      yiList: yi,
      jiList: ji,
      luckyColor: lucky[0],
      luckyNum: lucky[1],
      luckyDir: lucky[2],
      mood, quote,
      overallScore: score
    });
  },

  onShareAppMessage() {
    return { title: '今日宜忌 - 每天看一看，好运自然来', path: '/pages/ai/daily-advice/index' };
  }
});
