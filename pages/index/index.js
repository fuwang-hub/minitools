var ALL_MODULES = [
  {
    id: 'tools', emoji: '🔧', name: '实用工具',
    desc: '天气、计算器、房贷、记账、汇率...日常必备',
    color1: '#667eea', color2: '#764ba2',
    tools: [
      { id: 'weather', emoji: '🌤️', name: '天气预报', path: '/pages/tools/weather/index', tags: '天气温度气温' },
      { id: 'calculator', emoji: '🧮', name: '计算器', path: '/pages/tools/calculator/index', tags: '计算加减乘除' },
      { id: 'mortgage', emoji: '🏠', name: '房贷计算', path: '/pages/tools/mortgage/index', tags: '房贷月供贷款利率' },
      { id: 'bmi', emoji: '💪', name: 'BMI健康', path: '/pages/tools/bmi/index', tags: 'BMI体重健康体脂' },
      { id: 'ledger', emoji: '💰', name: '记账本', path: '/pages/tools/ledger/index', tags: '记账收支账单' },
      { id: 'countdown', emoji: '⏳', name: '倒数日', path: '/pages/tools/countdown/index', tags: '倒数日纪念日生日' },
      { id: 'exchange', emoji: '💱', name: '汇率换算', path: '/pages/tools/exchange/index', tags: '汇率换算美元欧元' },
      { id: 'stopwatch', emoji: '⏱️', name: '秒表计时', path: '/pages/tools/stopwatch/index', tags: '秒表计时器倒计时' },
      { id: 'ruler', emoji: '📏', name: '尺子测量', path: '/pages/tools/ruler/index', tags: '尺子测量长度厘米' },
      { id: 'noise', emoji: '🔊', name: '噪音检测', path: '/pages/tools/noise/index', tags: '噪音分贝检测声音' },
      { id: 'converter', emoji: '📐', name: '单位换算', path: '/pages/tools/converter/index', tags: '单位长度重量温度面积体积' },
      { id: 'coin', emoji: '🪙', name: '抛硬币', path: '/pages/tools/coin/index', tags: '硬币正反面随机决定' },
      { id: 'random', emoji: '🎲', name: '随机数', path: '/pages/tools/random/index', tags: '随机数字抽签' },
      { id: 'qrcode', emoji: '📱', name: '二维码', path: '/pages/tools/qrcode/index', tags: '二维码生成扫码' },
      { id: 'date-calc', emoji: '📅', name: '日期计算', path: '/pages/tools/date-calc/index', tags: '日期倒计时天数' },
      { id: 'password', emoji: '🔑', name: '密码生成', path: '/pages/tools/password/index', tags: '密码生成随机' }
    ]
  },
  {
    id: 'test', emoji: '🔮', name: '娱乐测试',
    desc: '探索你的性格、职业倾向和爱情语言',
    color1: '#f093fb', color2: '#f5576c',
    tools: [
      { id: 'mbti', emoji: '🧠', name: 'MBTI', path: '/pages/test/mbti/index', tags: 'MBTI性格人格测试' },
      { id: 'enneagram', emoji: '🔢', name: '九型人格', path: '/pages/test/enneagram/index', tags: '九型人格性格' },
      { id: 'career', emoji: '💼', name: '职业倾向', path: '/pages/test/career/index', tags: '职业工作测试' },
      { id: 'love-language', emoji: '💕', name: '爱情语言', path: '/pages/test/love-language/index', tags: '爱情恋爱语言' },
      { id: 'fun', emoji: '🎭', name: '趣味测试', path: '/pages/test/fun/index', tags: '趣味心理年龄超能力' }
    ]
  },
  {
    id: 'horoscope', emoji: '⭐', name: '星座运势',
    desc: '每日运势、星座配对、星盘分析',
    color1: '#4facfe', color2: '#00f2fe',
    tools: [
      { id: 'daily', emoji: '🌅', name: '今日运势', path: '/pages/horoscope/daily/index', tags: '星座运势今日每日' },
      { id: 'weekly', emoji: '📆', name: '本周运势', path: '/pages/horoscope/weekly/index', tags: '星座运势本周每周' },
      { id: 'match', emoji: '💑', name: '星座配对', path: '/pages/horoscope/match/index', tags: '星座配对恋爱' },
      { id: 'chart', emoji: '🌌', name: '星盘查询', path: '/pages/horoscope/chart/index', tags: '星盘星座查询' }
    ]
  },
  {
    id: 'metaphysics', emoji: '🔮', name: '传统玄学',
    desc: '姓名测试、生辰八字、周公解梦',
    color1: '#f59e0b', color2: '#ef4444',
    tools: [
      { id: 'name', emoji: '📝', name: '姓名测试', path: '/pages/metaphysics/name/index', tags: '姓名测试打分' },
      { id: 'bazi', emoji: '🏮', name: '生辰八字', path: '/pages/metaphysics/bazi/index', tags: '八字生辰五行' },
      { id: 'dream', emoji: '💭', name: '周公解梦', path: '/pages/metaphysics/dream/index', tags: '解梦周公梦境' },
      { id: 'divination', emoji: '🎋', name: '求签算卦', path: '/pages/metaphysics/divination/index', tags: '求签算卦抽签' },
      { id: 'zodiac-match', emoji: '🐉', name: '属相配对', path: '/pages/metaphysics/zodiac-match/index', tags: '属相生肖配对' }
    ]
  },
  {
    id: 'ai', emoji: '🤖', name: 'AI 工具',
    desc: '藏头诗、古风名字、答案之书',
    color1: '#0891b2', color2: '#6366f1',
    tools: [
      { id: 'acrostic', emoji: '📜', name: '藏头诗', path: '/pages/ai/acrostic/index', tags: '藏头诗诗词古诗' },
      { id: 'name-gen', emoji: '🏯', name: '古风名字', path: '/pages/ai/name-gen/index', tags: '古风名字取名' },
      { id: 'answer-book', emoji: '📖', name: '答案之书', path: '/pages/ai/answer-book/index', tags: '答案之书决策' },
      { id: 'daily-advice', emoji: '📿', name: '今日宜忌', path: '/pages/ai/daily-advice/index', tags: '宜忌黄历今日' }
    ]
  }
];

// 扁平化所有工具用于搜索
var ALL_TOOLS = [];
ALL_MODULES.forEach(function(m) {
  m.tools.forEach(function(t) {
    ALL_TOOLS.push(t);
  });
});

Page({
  data: {
    modules: ALL_MODULES,
    searchMode: false,
    searchKeyword: '',
    searchResults: []
  },

  // 搜索防抖 timer
  _searchTimer: null,
  // 跳转节流时间戳
  _lastNavTime: 0,

  onSearchFocus: function() {
    this.setData({ searchMode: true });
  },

  onSearchBlur: function() {
    var self = this;
    // 延迟关闭，防止点击搜索结果时 blur 先触发
    setTimeout(function() {
      if (!self.data.searchKeyword) {
        self.setData({ searchMode: false, searchResults: [] });
      }
    }, 200);
  },

  onSearchInput: function(e) {
    var keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });

    // 防抖搜索
    if (this._searchTimer) clearTimeout(this._searchTimer);
    if (!keyword) {
      this.setData({ searchResults: [] });
      return;
    }
    var self = this;
    this._searchTimer = setTimeout(function() {
      self._doSearch(keyword);
    }, 200);
  },

  _doSearch: function(keyword) {
    var kw = keyword.toLowerCase();
    var results = ALL_TOOLS.filter(function(t) {
      return t.name.toLowerCase().indexOf(kw) >= 0 ||
             (t.tags && t.tags.toLowerCase().indexOf(kw) >= 0);
    });
    this.setData({ searchResults: results });
  },

  onSearchClear: function() {
    this.setData({ searchKeyword: '', searchResults: [], searchMode: false });
  },

  onToolTap: function(e) {
    // 节流：防止快速双击
    var now = Date.now();
    if (now - this._lastNavTime < 500) return;
    this._lastNavTime = now;

    var path = e.currentTarget.dataset.path;
    wx.navigateTo({ url: path });
  },

  onModuleTap: function() {},

  onShareAppMessage: function() {
    return {
      title: '万能工具箱 - 日常生活小助手',
      path: '/pages/index/index'
    };
  },

  onShareTimeline: function() {
    return {
      title: '万能工具箱 - 一个小程序搞定日常所有小需求'
    };
  }
});
