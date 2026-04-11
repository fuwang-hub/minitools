const zodiacs = [
  { id: 0, name: '白羊座', emoji: '♈', date: '3.21-4.19' },
  { id: 1, name: '金牛座', emoji: '♉', date: '4.20-5.20' },
  { id: 2, name: '双子座', emoji: '♊', date: '5.21-6.21' },
  { id: 3, name: '巨蟹座', emoji: '♋', date: '6.22-7.22' },
  { id: 4, name: '狮子座', emoji: '♌', date: '7.23-8.22' },
  { id: 5, name: '处女座', emoji: '♍', date: '8.23-9.22' },
  { id: 6, name: '天秤座', emoji: '♎', date: '9.23-10.23' },
  { id: 7, name: '天蝎座', emoji: '♏', date: '10.24-11.22' },
  { id: 8, name: '射手座', emoji: '♐', date: '11.23-12.21' },
  { id: 9, name: '摩羯座', emoji: '♑', date: '12.22-1.19' },
  { id: 10, name: '水瓶座', emoji: '♒', date: '1.20-2.18' },
  { id: 11, name: '双鱼座', emoji: '♓', date: '2.19-3.20' }
];

const loveTexts = [
  '今天桃花运不错，单身的你可能会遇到心动的人。已有伴侣的关系会更加甜蜜。',
  '感情方面比较平稳，适合和伴侣一起做一些日常的事情，享受平淡的幸福。',
  '今天可能会因为一些小事与伴侣产生分歧，建议多一些包容和理解。',
  '桃花运旺盛，你的魅力今天格外耀眼，好好把握身边的机会。',
  '感情方面需要更多耐心，不要急于求成，让关系自然发展。',
  '今天适合向喜欢的人表达心意，勇敢迈出第一步，结果可能超出预期。'
];

const careerTexts = [
  '工作状态极佳，效率很高，适合处理重要项目和任务。抓住今天把关键事情搞定。',
  '今天在工作中可能遇到一些挑战，保持冷静分析，逐步解决问题。',
  '贵人运不错，可能会得到同事或上级的帮助，好好利用这次机会。',
  '适合进行创意性的工作，你的灵感今天特别丰富，不妨大胆尝试。',
  '注意工作中的细节，今天比较容易出现粗心大意的情况，检查再检查。',
  '今天人际关系融洽，是团队协作的好时机，多与同事沟通交流。'
];

const moneyTexts = [
  '财运不错，正财收入稳定。投资方面适合观望，不宜冒险。',
  '今天花钱的欲望比较强，建议克制一下消费冲动，留意必要支出。',
  '可能会收到一笔意外之财，或者之前的投资有所回报。',
  '财运平平，适合理财规划，不适合大额消费或投资。',
  '正财偏财都有不错的运势，但要量力而行，不要贪多。',
  '今天适合做一些财务规划，整理账目，优化支出结构。'
];

const healthTexts = [
  '身体状态良好，精力充沛。适合进行户外运动。',
  '注意饮食规律，少吃油腻辛辣的食物，多喝水。',
  '可能会感到一些疲劳，注意休息，不要过度劳累。',
  '今天适合做一些放松身心的活动，如瑜伽、冥想。',
  '身心状态都不错，保持良好的作息习惯。',
  '注意颈椎和腰椎，不要长时间保持同一姿势。'
];

const luckyColors = [
  { color: '#ef4444', name: '红色' },
  { color: '#f97316', name: '橙色' },
  { color: '#eab308', name: '黄色' },
  { color: '#22c55e', name: '绿色' },
  { color: '#3b82f6', name: '蓝色' },
  { color: '#8b5cf6', name: '紫色' },
  { color: '#ec4899', name: '粉色' },
  { color: '#fff', name: '白色' }
];

function getToday() {
  const d = new Date();
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateFortune(zodiacIndex) {
  const d = new Date();
  const daySeed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const seed = daySeed * 13 + zodiacIndex * 7;

  const r = (offset) => seededRandom(seed + offset);
  const pick = (arr, offset) => arr[Math.floor(r(offset) * arr.length)];
  const stars = (offset) => Math.floor(r(offset) * 3) + 3; // 3-5

  const lucky = pick(luckyColors, 100);
  const luckyNum = Math.floor(r(200) * 9) + 1;
  const matchIdx = Math.floor(r(300) * 12);

  return {
    overall: stars(1),
    love: stars(2),
    career: stars(3),
    money: stars(4),
    health: stars(5),
    loveText: pick(loveTexts, 10),
    careerText: pick(careerTexts, 20),
    moneyText: pick(moneyTexts, 30),
    healthText: pick(healthTexts, 40),
    luckyColor: lucky.color,
    luckyColorName: lucky.name,
    luckyNumber: luckyNum,
    matchZodiac: zodiacs[matchIdx].name
  };
}

Page({
  data: {
    zodiacs,
    activeZodiac: 0,
    fortune: null,
    today: getToday()
  },

  onLoad() {
    this._loadFortune(0);
  },

  onZodiacTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeZodiac: index });
    this._loadFortune(index);
  },

  _loadFortune(index) {
    const fortune = generateFortune(index);
    this.setData({ fortune });
  },

  onShareAppMessage() {
    const z = zodiacs[this.data.activeZodiac];
    return {
      title: z.emoji + ' ' + z.name + '今日运势 - 快来查看',
      path: '/pages/horoscope/daily/index'
    };
  }
});
