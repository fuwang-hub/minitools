// pages/metaphysics/dream/index.js
const dreamDB = {
  '蛇': { emoji: '🐍', meaning: '主财运，梦见蛇往往预示着财运亨通或有意外之财。', luck: '吉', detail: '梦见蛇缠身表示有人暗恋你；梦见被蛇咬表示近期有贵人相助；梦见打蛇表示能战胜困难。', advice: '近期适合做投资理财，但要理性决策。' },
  '水': { emoji: '💧', meaning: '主情感和财运。清水为吉，浑水为需谨慎。', luck: '半吉', detail: '梦见清澈的水表示心情愉快；梦见洪水表示可能有大的变动；梦见在水中游泳表示事业顺利。', advice: '注意控制情绪，保持内心平静。' },
  '飞': { emoji: '🕊️', meaning: '主自由和突破，表示你渴望摆脱束缚。', luck: '吉', detail: '梦见自己飞翔表示事业将有突破；梦见飞得很高表示目标远大；梦见掉下来表示需要脚踏实地。', advice: '大胆追求目标，但要注意方法和步骤。' },
  '考试': { emoji: '📝', meaning: '主压力和自我期望，反映对自身能力的担忧。', luck: '平', detail: '梦见考试不及格表示对自己要求过高；梦见考试顺利表示自信心增强；梦见迟到表示害怕错过机会。', advice: '放松心态，相信自己的能力，不要给自己太大压力。' },
  '死': { emoji: '🔄', meaning: '主新生和转变，并非凶兆。旧的结束，新的开始。', luck: '吉', detail: '梦见自己死亡表示即将迎来新的人生阶段；梦见亲人去世表示对亲人的关心和牵挂。', advice: '拥抱变化，每一次结束都是新的开始。' },
  '狗': { emoji: '🐕', meaning: '主友情和忠诚，代表身边朋友的状态。', luck: '吉', detail: '梦见友好的狗表示有忠诚的朋友；梦见被狗追表示人际关系需要注意；梦见小狗表示会有新的朋友。', advice: '珍惜身边的朋友，多联系维护感情。' },
  '猫': { emoji: '🐱', meaning: '主独立和直觉，也可能暗示身边有心机之人。', luck: '半吉', detail: '梦见可爱的猫表示生活愉快；梦见黑猫可能提醒要小心身边的人；梦见猫咪撒娇表示有桃花运。', advice: '提升自己的判断力，不要轻信他人。' },
  '钱': { emoji: '💰', meaning: '主财运和价值感，反映对物质的态度。', luck: '吉', detail: '梦见捡到钱表示会有意外收获；梦见丢钱表示要注意理财；梦见很多钱表示事业有成。', advice: '合理规划财务，该花的花该省的省。' },
  '房子': { emoji: '🏠', meaning: '主安全感和家庭，反映内心对归属感的需求。', luck: '吉', detail: '梦见新房子表示生活将有新的开始；梦见房子倒塌表示需要关注家庭关系；梦见装修表示自我提升。', advice: '多关心家人，营造温馨的家庭氛围。' },
  '花': { emoji: '🌸', meaning: '主美好和浪漫，预示着好事将至。', luck: '吉', detail: '梦见鲜花盛开表示好运连连；梦见花凋谢表示要珍惜当下；梦见送花表示会有感情发展。', advice: '享受生活中的美好事物，保持乐观心态。' },
  '跑': { emoji: '🏃', meaning: '主追求和逃避，反映面对问题的态度。', luck: '平', detail: '梦见跑步表示在追求目标；梦见被追着跑表示有逃避的问题；梦见跑不动表示感到无力。', advice: '正视问题，不逃避才能真正解决。' },
  '下雨': { emoji: '🌧️', meaning: '主净化和情感释放，是内心情绪的反映。', luck: '吉', detail: '梦见下小雨表示心情平静；梦见暴雨表示情绪需要释放；梦见雨后彩虹表示困难即将过去。', advice: '适当释放情绪，不要把所有事情都憋在心里。' },
  '结婚': { emoji: '💍', meaning: '主承诺和新阶段，不一定与婚姻有关。', luck: '吉', detail: '梦见自己结婚表示人生将进入新阶段；梦见别人结婚表示会收到好消息。', advice: '做好迎接人生新阶段的准备。' },
  '牙齿': { emoji: '🦷', meaning: '主自信和形象，掉牙可能代表对衰老的焦虑。', luck: '平', detail: '梦见掉牙表示对变化的不安；梦见牙齿洁白表示自信十足；梦见看牙医表示需要面对问题。', advice: '关注身体健康，保持积极的心态面对变化。' },
  '车': { emoji: '🚗', meaning: '主人生方向和控制感。', luck: '半吉', detail: '梦见开车表示掌控人生方向；梦见车祸表示需要放慢脚步；梦见新车表示新的机遇。', advice: '掌握好人生方向，不要急于求成。' }
};

const defaultResult = { emoji: '🔮', meaning: '此梦境比较特殊，需要结合个人具体情况分析。', luck: '平', detail: '每个梦境都有其独特的含义，建议关注梦中的情感体验，那往往才是真正的寓意所在。', advice: '保持良好的心态，注意休息和放松。' };

Page({
  data: {
    keyword: '',
    hotWords: ['蛇', '水', '飞', '考试', '钱', '猫', '狗', '房子', '花', '结婚', '牙齿', '下雨'],
    showResult: false,
    result: null,
    searchWord: ''
  },

  onInput(e) { this.setData({ keyword: e.detail.value }); },

  searchDream() {
    const kw = this.data.keyword.trim();
    if (!kw) { wx.showToast({ title: '请输入梦境关键词', icon: 'none' }); return; }
    this.doSearch(kw);
  },

  tapHot(e) {
    const { word } = e.currentTarget.dataset;
    this.setData({ keyword: word });
    this.doSearch(word);
  },

  doSearch(kw) {
    let result = null;
    for (const key in dreamDB) {
      if (kw.includes(key) || key.includes(kw)) {
        result = { key, ...dreamDB[key] };
        break;
      }
    }
    if (!result) result = { key: kw, ...defaultResult };
    this.setData({ showResult: true, result, searchWord: kw });
  },

  restart() { this.setData({ keyword: '', showResult: false, result: null }); },

  onShareAppMessage() {
    return { title: '周公解梦 - 解读你的梦境密码', path: '/pages/metaphysics/dream/index' };
  }
});
