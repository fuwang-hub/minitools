// pages/metaphysics/name/index.js
function getStrokes(char) {
  const code = char.charCodeAt(0);
  // 简化的笔画算法，基于Unicode编码范围估算
  if (code >= 0x4e00 && code <= 0x9fff) {
    return ((code - 0x4e00) % 20) + 3;
  }
  return code % 15 + 2;
}

function calcFiveGrid(surname, givenName) {
  const s1 = surname.split('').reduce((sum, c) => sum + getStrokes(c), 0);
  const g1 = givenName.charAt(0) ? getStrokes(givenName.charAt(0)) : 0;
  const g2 = givenName.length > 1 ? getStrokes(givenName.charAt(1)) : 0;

  return {
    tianGe: s1 + 1,            // 天格
    renGe: s1 + g1,            // 人格
    diGe: g1 + g2 + 1,        // 地格
    waiGe: s1 + g2 + 1,       // 外格
    zongGe: s1 + g1 + g2      // 总格
  };
}

function getGeLuck(ge) {
  const n = ge % 10;
  if ([1,3,5,6,7,8].includes(n)) return { luck: '吉', color: '#059669' };
  if ([2,4].includes(n)) return { luck: '半吉', color: '#F59E0B' };
  return { luck: '凶', color: '#EF4444' };
}

const wuxing = ['金','木','水','火','土'];

function analyzeHanzi(name) {
  const total = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return wuxing[total % 5];
}

Page({
  data: {
    surname: '',
    givenName: '',
    showResult: false,
    result: null
  },

  onSurnameInput(e) { this.setData({ surname: e.detail.value }); },
  onGivenInput(e) { this.setData({ givenName: e.detail.value }); },

  analyze() {
    const { surname, givenName } = this.data;
    if (!surname || !givenName) {
      wx.showToast({ title: '请输入完整姓名', icon: 'none' }); return;
    }
    const fullName = surname + givenName;
    const grid = calcFiveGrid(surname, givenName);
    const gridItems = [
      { name: '天格', value: grid.tianGe, ...getGeLuck(grid.tianGe), desc: '代表先天运势，影响前半生' },
      { name: '人格', value: grid.renGe, ...getGeLuck(grid.renGe), desc: '代表主运，影响一生命运核心' },
      { name: '地格', value: grid.diGe, ...getGeLuck(grid.diGe), desc: '代表前运，影响36岁前运势' },
      { name: '外格', value: grid.waiGe, ...getGeLuck(grid.waiGe), desc: '代表副运，影响社交和外部环境' },
      { name: '总格', value: grid.zongGe, ...getGeLuck(grid.zongGe), desc: '代表后运，影响36岁后运势' }
    ];

    const jiCount = gridItems.filter(g => g.luck === '吉').length;
    const totalScore = Math.min(99, 60 + jiCount * 8 + (fullName.length === 3 ? 3 : 0));
    const nameWuxing = analyzeHanzi(fullName);

    const personalityTraits = [
      '性格温和', '做事稳重', '思维敏捷', '心地善良', '意志坚定',
      '富有创意', '善于社交', '独立自主', '乐观开朗', '细心谨慎'
    ];
    const seed = fullName.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const traits = [
      personalityTraits[seed % 10],
      personalityTraits[(seed + 3) % 10],
      personalityTraits[(seed + 7) % 10]
    ];

    const careerAdvice = totalScore >= 85 ? '事业运势极佳，适合自主创业或担任领导角色。' :
                         totalScore >= 70 ? '事业发展稳定，在团队中能发挥重要作用。' :
                         '事业方面需要多努力，脚踏实地才能有所成就。';
    const loveAdvice = totalScore >= 85 ? '感情方面桃花旺盛，有望遇到理想伴侣。' :
                       totalScore >= 70 ? '感情运势不错，用心经营会收获幸福。' :
                       '感情方面需要多一些耐心，缘分自会到来。';

    this.setData({
      showResult: true,
      result: {
        fullName, surname, givenName,
        totalScore,
        gridItems,
        nameWuxing,
        traits,
        careerAdvice,
        loveAdvice,
        level: totalScore >= 90 ? '极佳' : totalScore >= 80 ? '优秀' : totalScore >= 70 ? '良好' : totalScore >= 60 ? '一般' : '偏弱'
      }
    });
  },

  restart() {
    this.setData({ surname: '', givenName: '', showResult: false, result: null });
  },

  onShareAppMessage() {
    const { result } = this.data;
    if (result) return { title: '我的名字评分' + result.totalScore + '分，来测测你的！', path: '/pages/metaphysics/name/index' };
    return { title: '姓名测试打分', path: '/pages/metaphysics/name/index' };
  }
});
