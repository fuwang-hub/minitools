// pages/test/career/index.js
const questions = [
  { id: 1, text: '你更喜欢哪种工作环境？', options: ['户外或动手操作的环境', '安静的研究室或实验室', '充满创意和自由的空间', '需要与人互动交流的场所', '有明确目标和竞争的团队', '有秩序有规则的办公室'] },
  { id: 2, text: '休息日你最想做什么？', options: ['做手工/运动/户外', '看书/研究/解谜', '画画/写作/设计', '和朋友聚会/志愿活动', '组织活动/谈合作', '整理房间/做计划'] },
  { id: 3, text: '你最擅长什么？', options: ['动手能力强', '逻辑分析强', '想象力丰富', '善于沟通协调', '领导和说服', '细心有条理'] },
  { id: 4, text: '你最看重工作的什么？', options: ['实际成果看得见', '能学到新知识', '能表达自我', '能帮助别人', '能获得成就', '稳定有保障'] },
  { id: 5, text: '面对难题你倾向于：', options: ['亲自动手尝试', '收集数据分析', '换个角度创新', '找人商量讨论', '果断决策推进', '按流程一步步来'] },
  { id: 6, text: '你理想的同事是：', options: ['踏实能干的', '聪明博学的', '有趣有个性的', '温暖友善的', '有干劲有野心的', '靠谱守规矩的'] }
];

const careerTypes = {
  R: { name: '实干型', emoji: '🔧', color: '#059669', title: '脚踏实地的行动派',
    desc: '你喜欢动手操作，擅长用实际行动解决问题。你重视结果，不喜欢空谈。',
    careers: ['工程师', '建筑师', '技术工人', '运动教练', '厨师', '农业技术员', '机械师'],
    traits: ['动手能力强', '务实可靠', '体力好', '不怕吃苦'] },
  I: { name: '研究型', emoji: '🔬', color: '#2563EB', title: '深度思考的探索者',
    desc: '你热爱学习和研究，善于用逻辑和数据分析问题。你享受解开谜题的过程。',
    careers: ['科学家', '程序员', '数据分析师', '医生', '心理学家', '大学教授', '研究员'],
    traits: ['逻辑性强', '好奇心重', '善于分析', '独立思考'] },
  A: { name: '艺术型', emoji: '🎨', color: '#7C3AED', title: '灵感四溢的创造者',
    desc: '你富有想象力和创造力，喜欢用独特的方式表达自我。你追求美和自由。',
    careers: ['设计师', '画家', '作家', '音乐人', '摄影师', '导演', 'UI设计师'],
    traits: ['创意丰富', '审美好', '感性细腻', '追求自由'] },
  S: { name: '社会型', emoji: '🤝', color: '#EC4899', title: '温暖贴心的助人者',
    desc: '你善于与人沟通，乐于帮助他人。你能敏锐地感受到别人的需求。',
    careers: ['教师', '心理咨询师', '社工', '护士', 'HR', '客户经理', '公关'],
    traits: ['善于沟通', '同理心强', '乐于助人', '有耐心'] },
  E: { name: '企业型', emoji: '💼', color: '#F59E0B', title: '雄心勃勃的领导者',
    desc: '你有天生的领导力和说服力，喜欢挑战和竞争，善于把握机会。',
    careers: ['企业管理', '销售总监', '创业者', '律师', '投资人', '市场总监', '政治家'],
    traits: ['领导力强', '有魄力', '善于说服', '目标明确'] },
  C: { name: '常规型', emoji: '📊', color: '#6B7280', title: '严谨可靠的组织者',
    desc: '你做事有条理，注重细节和规则。你是团队中最靠谱的执行者。',
    careers: ['会计师', '审计师', '行政管理', '银行职员', '档案管理', '财务分析', '质量管控'],
    traits: ['细心严谨', '有条理', '守规则', '执行力强'] }
};

const typeKeys = ['R', 'I', 'A', 'S', 'E', 'C'];

Page({
  data: {
    currentQuestion: 0,
    answers: [],
    showResult: false,
    result: null,
    subResult: null,
    progress: 0
  },

  handleAnswer(e) {
    const { index } = e.currentTarget.dataset;
    const { currentQuestion, answers } = this.data;
    const newAnswers = [...answers, index];

    if (currentQuestion < questions.length - 1) {
      this.setData({
        currentQuestion: currentQuestion + 1,
        answers: newAnswers,
        progress: Math.round(((currentQuestion + 1) / questions.length) * 100)
      });
    } else {
      this.calculateResult(newAnswers);
    }
  },

  calculateResult(answers) {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    answers.forEach(ansIdx => {
      scores[typeKeys[ansIdx]] += 1;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const mainType = sorted[0][0];
    const subType = sorted[1][0];

    this.setData({
      showResult: true,
      progress: 100,
      result: careerTypes[mainType],
      subResult: careerTypes[subType],
      hollandCode: mainType + subType + sorted[2][0]
    });
  },

  restart() {
    this.setData({ currentQuestion: 0, answers: [], showResult: false, result: null, subResult: null, progress: 0 });
  },

  onShareAppMessage() {
    const { result } = this.data;
    return {
      title: result ? '我的职业类型是' + result.name + '，你呢？' : '职业倾向测试',
      path: '/pages/test/career/index'
    };
  }
});
