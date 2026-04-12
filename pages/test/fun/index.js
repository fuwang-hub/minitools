// pages/test/fun/index.js
const tests = [
  { id: 'mental-age', name: '心理年龄测试', emoji: '🧒', color: '#8B5CF6', desc: '你的心理年龄是多少？',
    questions: [
      { text: '朋友约你出去，你的反应是：', options: ['太棒了马上出发！', '看看是什么活动再说', '能不能改天，我想休息'] },
      { text: '看到新出的手机游戏：', options: ['立刻下载试试', '看看评价再决定', '不感兴趣'] },
      { text: '遇到不开心的事：', options: ['很快就忘了', '会想一阵子', '反复纠结很久'] },
      { text: '对未来的态度：', options: ['充满期待', '有计划在推进', '有些担忧'] },
      { text: '购物时你倾向于：', options: ['看到喜欢就买', '比较后再买', '需要才买'] }
    ],
    calcResult(answers) {
      let score = 0;
      answers.forEach(a => { score += a; });
      if (score <= 3) return { value: '18岁', desc: '你的内心依然年轻充满活力！保持这份童心，生活会更加精彩。', emoji: '🌟' };
      if (score <= 6) return { value: '28岁', desc: '你成熟稳重又不失活力，这是最佳的心理状态！', emoji: '✨' };
      if (score <= 9) return { value: '38岁', desc: '你比较成熟理性，建议偶尔放松一下，找回年轻的心态。', emoji: '🍃' };
      return { value: '48岁', desc: '你的心态偏向成熟保守，试着多尝试新事物，会有意想不到的收获！', emoji: '🌿' };
    }
  },
  { id: 'lucky-color', name: '幸运色测试', emoji: '🌈', color: '#EC4899', desc: '什么颜色最旺你？',
    questions: [
      { text: '你最喜欢的季节？', options: ['春天', '夏天', '秋天', '冬天'] },
      { text: '选一个你最喜欢的元素：', options: ['火🔥', '水💧', '木🌿', '金✨'] },
      { text: '你的性格更偏向：', options: ['热情外向', '温柔内敛', '稳重踏实', '灵活多变'] },
      { text: '选一个让你心动的场景：', options: ['海边日落', '森林小屋', '城市夜景', '雪山之巅'] }
    ],
    calcResult(answers) {
      const colors = [
        { value: '红色 ❤️', hex: '#EF4444', desc: '红色代表热情和勇气，能给你带来好运和正能量！适合在重要场合穿戴。' },
        { value: '蓝色 💙', hex: '#3B82F6', desc: '蓝色代表智慧和宁静，能帮你保持冷静和清晰的思维！适合工作和学习时使用。' },
        { value: '绿色 💚', hex: '#10B981', desc: '绿色代表生机和财运，能给你带来好运和健康！适合日常穿搭和居家装饰。' },
        { value: '紫色 💜', hex: '#8B5CF6', desc: '紫色代表神秘和高贵，能提升你的气质和魅力！适合社交场合使用。' }
      ];
      const total = answers.reduce((s, a) => s + a, 0);
      return { ...colors[total % 4], emoji: '🎨' };
    }
  },
  { id: 'superpower', name: '超能力测试', emoji: '⚡', color: '#F59E0B', desc: '你最适合什么超能力？',
    questions: [
      { text: '危急时刻你的第一反应是：', options: ['冲上去帮忙', '冷静分析情况', '保护身边的人', '寻找安全出口'] },
      { text: '你最羡慕哪种能力：', options: ['力大无穷', '过目不忘', '预知未来', '读心术'] },
      { text: '选一个你最想去的地方：', options: ['太空', '海底', '远古', '平行世界'] },
      { text: '你觉得自己的直觉：', options: ['很准', '偶尔准', '一般', '不太好'] }
    ],
    calcResult(answers) {
      const powers = [
        { value: '时间操控', desc: '你有超强的时间管理意识和未来洞察力，时间操控是你的命定超能力！你可以暂停、回溯和快进时间。', emoji: '⏰' },
        { value: '心灵感应', desc: '你的共情能力和直觉都很强，心灵感应是你的天赋超能力！你可以读取他人的想法和感受。', emoji: '🧠' },
        { value: '元素掌控', desc: '你性格沉稳而有力量，元素掌控是你的核心超能力！你可以操控火、水、风、土四大元素。', emoji: '🔥' },
        { value: '空间穿越', desc: '你的想象力无限，渴望探索未知，空间穿越是你的终极超能力！你可以穿越到任何地方。', emoji: '🌀' }
      ];
      const total = answers.reduce((s, a) => s + a, 0);
      return { ...powers[total % 4] };
    }
  },
  { id: 'animal', name: '灵魂动物测试', emoji: '🦊', color: '#059669', desc: '你的灵魂动物是什么？',
    questions: [
      { text: '你在朋友圈中的角色：', options: ['领导者', '搞笑担当', '倾听者', '智囊团'] },
      { text: '面对困难你会：', options: ['正面硬刚', '灵活应对', '寻求帮助', '静观其变'] },
      { text: '你的理想生活是：', options: ['自由自在', '温馨稳定', '刺激冒险', '简单宁静'] },
      { text: '别人第一印象觉得你：', options: ['霸气', '可爱', '温柔', '高冷'] }
    ],
    calcResult(answers) {
      const animals = [
        { value: '狮子 🦁', desc: '你天生具有领袖气质，勇敢自信，有着强大的保护欲。你是群体中的核心人物，值得信赖的存在。', emoji: '🦁' },
        { value: '狐狸 🦊', desc: '你聪明灵活，善于应变，有着超强的适应能力。你的机智和幽默让身边的人都很喜欢你。', emoji: '🦊' },
        { value: '海豚 🐬', desc: '你温柔善良，善于沟通，有着天生的治愈力。你总能让身边的人感到温暖和快乐。', emoji: '🐬' },
        { value: '猫头鹰 🦉', desc: '你智慧深沉，独立思考，有着敏锐的洞察力。你总能看到别人看不到的真相。', emoji: '🦉' }
      ];
      const total = answers.reduce((s, a) => s + a, 0);
      return { ...animals[total % 4] };
    }
  }
];

Page({
  data: {
    mode: 'list',
    tests: tests.map(t => ({ id: t.id, name: t.name, emoji: t.emoji, color: t.color, desc: t.desc })),
    currentTest: null,
    currentQuestion: 0,
    answers: [],
    showResult: false,
    result: null,
    progress: 0
  },

  selectTest(e) {
    const { id } = e.currentTarget.dataset;
    const test = tests.find(t => t.id === id);
    this.setData({
      mode: 'test',
      currentTest: test,
      currentQuestion: 0,
      answers: [],
      showResult: false,
      result: null,
      progress: 0
    });
  },

  handleAnswer(e) {
    const { index } = e.currentTarget.dataset;
    const { currentTest, currentQuestion, answers } = this.data;
    const newAnswers = [...answers, index];
    const total = currentTest.questions.length;

    if (currentQuestion < total - 1) {
      this.setData({
        currentQuestion: currentQuestion + 1,
        answers: newAnswers,
        progress: Math.round(((currentQuestion + 1) / total) * 100)
      });
    } else {
      const result = currentTest.calcResult(newAnswers);
      this.setData({ answers: newAnswers, showResult: true, progress: 100, result });
    }
  },

  restart() {
    this.setData({ currentQuestion: 0, answers: [], showResult: false, result: null, progress: 0 });
  },

  backToList() {
    this.setData({ mode: 'list', currentTest: null, showResult: false });
  },

  onShareAppMessage() {
    var share = require('../../../utils/share');
    var r = this.data.result;
    var t = this.data.currentTest;
    if (r && t) {
      return share.buildShareConfig('fun', { result: t.name + '：' + r.value }, '/pages/test/fun/index');
    }
    return share.buildShareConfig('fun', { result: '' }, '/pages/test/fun/index');
  },

  onShareTimeline() {
    var share = require('../../../utils/share');
    var r = this.data.result;
    var t = this.data.currentTest;
    return share.buildTimelineConfig('fun', { result: r && t ? r.value : '趣味测试合集' });
  },

  showPoster() {
    var r = this.data.result || {};
    var t = this.data.currentTest || {};
    this.setData({
      showPoster: true,
      posterData: {
        emoji: r.emoji || '🎭', title: t.name || '趣味测试', subtitle: '我的测试结果',
        result: r.value || '', highlight: '', desc: r.desc || '',
        qrTip: '扫一扫，你也来测测！'
      }
    });
  },

  closePoster() { this.setData({ showPoster: false }); },
  onUnlocked() { this.setData({ detailUnlocked: true }); }
});
