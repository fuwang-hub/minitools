// pages/ai/name-gen/index.js
const surnames = ['慕容','上官','欧阳','司马','诸葛','东方','南宫','西门','北堂','独孤','轩辕','皇甫','令狐','公孙','夏侯','尉迟','长孙','宇文','端木','百里','云','林','苏','沈','顾','萧','叶','温','谢','陆','白','楚','江','柳','凌','秦','慕','容','裴','季','方','许','程','韩'];
const maleChars = [['逸','轩','辰','泽','瑾','瑜','煜','霆','昊','宸'],['风','云','霄','天','岳','渊','烨','曜','翊','廷'],['清','明','景','耀','峻','朗','墨','尘','澈','寒']];
const femaleChars = [['婉','清','若','初','念','浅','落','绾','吟','韵'],['月','雪','烟','霜','兮','瑶','璃','颜','汐','眠'],['倾','城','画','梦','舞','歌','琴','棠','蝶','瑟']];
const styles = ['仙侠','古典','诗意','霸气','温柔'];
const meaningPool = {
  male: ['此名取意高远，如鹰击长空，有凌云之志。', '此名蕴含山水之韵，胸怀天地，气度非凡。', '此名含星辰日月之华，光芒万丈，前途无量。', '此名似清风明月，温润如玉，才华横溢。', '此名如松柏常青，坚韧不拔，成就非凡。'],
  female: ['此名如清泉明月，温婉动人，灵秀天成。', '此名含花落云烟之美，清雅脱俗，倾国倾城。', '此名似春风化雨，柔中带刚，内外兼修。', '此名如画中仙子，飘逸出尘，气质非凡。', '此名含诗意画境，才情出众，令人心动。']
};

function genName(gender, style) {
  const s = surnames[Math.floor(Math.random() * surnames.length)];
  const pool = gender === 'male' ? maleChars : femaleChars;
  const row = pool[Math.floor(Math.random() * pool.length)];
  const c1 = row[Math.floor(Math.random() * row.length)];
  let c2 = '';
  if (Math.random() > 0.4) {
    const row2 = pool[Math.floor(Math.random() * pool.length)];
    c2 = row2[Math.floor(Math.random() * row2.length)];
  }
  const name = s + c1 + c2;
  const meanings = gender === 'male' ? meaningPool.male : meaningPool.female;
  return { name, meaning: meanings[Math.floor(Math.random() * meanings.length)], style };
}

Page({
  data: {
    gender: 'male',
    style: '古典',
    styles,
    names: [],
    showResult: false
  },

  setGender(e) { this.setData({ gender: e.currentTarget.dataset.gender }); },
  setStyle(e) { this.setData({ style: e.currentTarget.dataset.style }); },

  generate() {
    const { gender, style } = this.data;
    const names = [];
    for (let i = 0; i < 6; i++) {
      names.push(genName(gender, style));
    }
    this.setData({ names, showResult: true });
  },

  copyName(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.name, success() { wx.showToast({ title: '已复制' }); } });
  },

  restart() { this.setData({ names: [], showResult: false }); },

  onShareAppMessage() {
    return { title: '帮你起一个绝美的古风名字！', path: '/pages/ai/name-gen/index' };
  }
,
  onShareTimeline: function() {
    var share = require("../../../utils/share");
    return share.buildTimelineConfig("default", {});
  }
});