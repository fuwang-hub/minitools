// pages/ai/acrostic/index.js
const poemLib = {
  2: [
    ['{0}日风光好', '{1}来万事兴'],
    ['{0}风送暖入屠苏', '{1}水千山总是情'],
    ['{0}光似箭催人老', '{1}色如诗画中来']
  ],
  3: [
    ['{0}上高楼望远天', '{1}来紫气满山川', '{2}心如意乐无边'],
    ['{0}风化雨润心田', '{1}月当空照大千', '{2}歌一曲动云天'],
    ['{0}阳初照映霞光', '{1}水长流润八方', '{2}花盛开满庭芳']
  ],
  4: [
    ['{0}光映照千山秀', '{1}水东流万里长', '{2}风送暖入花丛', '{3}色满园春意浓'],
    ['{0}日高悬照九州', '{1}来大地换新裘', '{2}年好景君须记', '{3}心如意乐悠悠'],
    ['{0}天高远碧云间', '{1}地辽阔山水连', '{2}生有幸逢盛世', '{3}享太平乐无边']
  ],
  5: [
    ['{0}光普照大地春', '{1}水潺潺润万民', '{2}风阵阵花开早', '{3}云缕缕鸟鸣新', '{4}心无忧乐天真'],
    ['{0}日当空照四方', '{1}来瑞雪兆丰祥', '{2}通四海皆兄弟', '{3}笑人间有情长', '{4}寿无疆福满堂']
  ]
};

function generatePoem(text) {
  const chars = text.split('');
  const len = chars.length;
  const templates = poemLib[Math.min(len, 5)] || poemLib[3];
  const tpl = templates[Math.floor(Math.random() * templates.length)];
  
  const lines = [];
  for (let i = 0; i < Math.min(len, tpl.length); i++) {
    lines.push(tpl[i].replace('{' + i + '}', chars[i]));
  }
  // 如果输入超过模板长度，补充额外行
  for (let i = tpl.length; i < len; i++) {
    lines.push(chars[i] + '意悠悠韵味长');
  }
  return lines;
}

Page({
  data: {
    inputText: '',
    showResult: false,
    poemLines: [],
    history: []
  },

  onInput(e) { this.setData({ inputText: e.detail.value }); },

  generate() {
    const text = this.data.inputText.trim();
    if (!text) { wx.showToast({ title: '请输入藏头文字', icon: 'none' }); return; }
    if (text.length < 2 || text.length > 8) { wx.showToast({ title: '请输入2-8个字', icon: 'none' }); return; }

    var poemLines = generatePoem(text);
    var poemDisplay = poemLines.map(function(line) {
      return { firstChar: line.charAt(0), restChars: line.substring(1), full: line };
    });
    var history = [{ text: text, lines: poemLines, time: new Date().toLocaleString() }].concat(this.data.history).slice(0, 10);
    this.setData({ showResult: true, poemLines: poemLines, poemDisplay: poemDisplay, history: history });
  },

  copyPoem() {
    const text = this.data.poemLines.join('\n');
    wx.setClipboardData({ data: text, success() { wx.showToast({ title: '已复制' }); } });
  },

  restart() { this.setData({ inputText: '', showResult: false, poemLines: [] }); },

  onShareAppMessage() {
    return { title: '我用藏头诗表白，你也来试试！', path: '/pages/ai/acrostic/index' };
  }
});
