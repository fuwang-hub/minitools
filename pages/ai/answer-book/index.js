// pages/ai/answer-book/index.js
const answers = [
  { text: '是的', emoji: '✅', type: 'positive' },
  { text: '当然可以', emoji: '👍', type: 'positive' },
  { text: '毫无疑问', emoji: '💯', type: 'positive' },
  { text: '放手去做吧', emoji: '🚀', type: 'positive' },
  { text: '前景非常好', emoji: '🌟', type: 'positive' },
  { text: '你已经知道答案了', emoji: '💡', type: 'positive' },
  { text: '相信你的直觉', emoji: '✨', type: 'positive' },
  { text: '一切都会好起来的', emoji: '🌈', type: 'positive' },
  { text: '好运正在路上', emoji: '🍀', type: 'positive' },
  { text: '大胆向前走', emoji: '🦁', type: 'positive' },
  { text: '再想想', emoji: '🤔', type: 'neutral' },
  { text: '现在不是时候', emoji: '⏰', type: 'neutral' },
  { text: '换个角度思考', emoji: '🔄', type: 'neutral' },
  { text: '问问你的朋友', emoji: '👥', type: 'neutral' },
  { text: '明天再做决定', emoji: '🌅', type: 'neutral' },
  { text: '顺其自然', emoji: '🍃', type: 'neutral' },
  { text: '别太在意结果', emoji: '😌', type: 'neutral' },
  { text: '时机未到', emoji: '⌛', type: 'neutral' },
  { text: '恐怕不行', emoji: '😅', type: 'negative' },
  { text: '不太建议', emoji: '🚫', type: 'negative' },
  { text: '三思而后行', emoji: '⚠️', type: 'negative' },
  { text: '这次就算了吧', emoji: '🙈', type: 'negative' },
  { text: '还是别了', emoji: '👋', type: 'negative' }
];

const bgColors = {
  positive: 'linear-gradient(135deg, #059669, #10b981)',
  neutral: 'linear-gradient(135deg, #d97706, #f59e0b)',
  negative: 'linear-gradient(135deg, #dc2626, #ef4444)'
};

Page({
  data: {
    question: '',
    phase: 'input', // input, thinking, result
    answer: null,
    history: []
  },

  onInput(e) { this.setData({ question: e.detail.value }); },

  askQuestion() {
    const q = this.data.question.trim();
    if (!q) { wx.showToast({ title: '请先输入你的问题', icon: 'none' }); return; }
    this.setData({ phase: 'thinking' });
    setTimeout(() => {
      const answer = answers[Math.floor(Math.random() * answers.length)];
      const history = [{ q, a: answer, time: new Date().toLocaleTimeString() }, ...this.data.history].slice(0, 20);
      this.setData({ phase: 'result', answer, history });
    }, 1500);
  },

  askAgain() {
    this.setData({ phase: 'input', question: '', answer: null });
  },

  onShareAppMessage() {
    const { answer } = this.data;
    if (answer) return { title: '答案之书告诉我：' + answer.text, path: '/pages/ai/answer-book/index' };
    return { title: 'AI答案之书 - 为你指引方向', path: '/pages/ai/answer-book/index' };
  }
});
