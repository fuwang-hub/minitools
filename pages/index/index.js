Page({
  data: {
    modules: [
      {
        id: 'tools',
        emoji: '🔧',
        name: '实用工具',
        desc: '计算器、单位换算、二维码...日常必备',
        color1: '#667eea',
        color2: '#764ba2',
        tools: [
          { id: 'calculator', emoji: '🧮', name: '计算器', path: '/pages/tools/calculator/index' },
          { id: 'converter', emoji: '📐', name: '单位换算', path: '/pages/tools/converter/index' },
          { id: 'coin', emoji: '🪙', name: '抛硬币', path: '/pages/tools/coin/index' },
          { id: 'random', emoji: '🎲', name: '随机数', path: '/pages/tools/random/index' },
          { id: 'qrcode', emoji: '📱', name: '二维码', path: '/pages/tools/qrcode/index' },
          { id: 'date-calc', emoji: '📅', name: '日期计算', path: '/pages/tools/date-calc/index' },
          { id: 'password', emoji: '🔑', name: '密码生成', path: '/pages/tools/password/index' }
        ]
      },
      {
        id: 'test',
        emoji: '🔮',
        name: '娱乐测试',
        desc: '探索你的性格、职业倾向和爱情语言',
        color1: '#f093fb',
        color2: '#f5576c',
        tools: [
          { id: 'mbti', emoji: '🧠', name: 'MBTI', path: '/pages/test/mbti/index' },
          { id: 'enneagram', emoji: '🔢', name: '九型人格', path: '/pages/test/enneagram/index' },
          { id: 'career', emoji: '💼', name: '职业倾向', path: '/pages/test/career/index' },
          { id: 'love-language', emoji: '💕', name: '爱情语言', path: '/pages/test/love-language/index' },
          { id: 'fun', emoji: '🎭', name: '趣味测试', path: '/pages/test/fun/index' }
        ]
      },
      {
        id: 'horoscope',
        emoji: '⭐',
        name: '星座运势',
        desc: '每日运势、星座配对、星盘分析',
        color1: '#4facfe',
        color2: '#00f2fe',
        tools: [
          { id: 'daily', emoji: '🌅', name: '今日运势', path: '/pages/horoscope/daily/index' },
          { id: 'weekly', emoji: '📆', name: '本周运势', path: '/pages/horoscope/weekly/index' },
          { id: 'match', emoji: '💑', name: '星座配对', path: '/pages/horoscope/match/index' },
          { id: 'chart', emoji: '🌌', name: '星盘查询', path: '/pages/horoscope/chart/index' }
        ]
      },
      {
        id: 'metaphysics',
        emoji: '🔮',
        name: '传统玄学',
        desc: '姓名测试、生辰八字、周公解梦',
        color1: '#f59e0b',
        color2: '#ef4444',
        tools: [
          { id: 'name', emoji: '📝', name: '姓名测试', path: '/pages/metaphysics/name/index' },
          { id: 'bazi', emoji: '🏮', name: '生辰八字', path: '/pages/metaphysics/bazi/index' },
          { id: 'dream', emoji: '💭', name: '周公解梦', path: '/pages/metaphysics/dream/index' },
          { id: 'divination', emoji: '🎋', name: '求签算卦', path: '/pages/metaphysics/divination/index' },
          { id: 'zodiac-match', emoji: '🐉', name: '属相配对', path: '/pages/metaphysics/zodiac-match/index' }
        ]
      },
      {
        id: 'ai',
        emoji: '🤖',
        name: 'AI 工具',
        desc: '藏头诗、古风名字、答案之书',
        color1: '#0891b2',
        color2: '#6366f1',
        tools: [
          { id: 'acrostic', emoji: '📜', name: '藏头诗', path: '/pages/ai/acrostic/index' },
          { id: 'name-gen', emoji: '🏯', name: '古风名字', path: '/pages/ai/name-gen/index' },
          { id: 'answer-book', emoji: '📖', name: '答案之书', path: '/pages/ai/answer-book/index' },
          { id: 'daily-advice', emoji: '📿', name: '今日宜忌', path: '/pages/ai/daily-advice/index' }
        ]
      }
    ]
  },

  onToolTap(e) {
    const path = e.currentTarget.dataset.path;
    wx.navigateTo({ url: path });
  },

  onModuleTap() {
    // 点击模块卡片时不做额外操作，让内部 tool-item 的 catchtap 处理
  },

  onSearchTap() {
    wx.showToast({ title: '搜索功能开发中', icon: 'none' });
  },

  onShareAppMessage() {
    return {
      title: '万能工具箱 - 日常生活小助手',
      path: '/pages/index/index'
    };
  }
});
