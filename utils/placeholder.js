/**
 * 创建占位页面配置
 * @param {string} title - 页面标题
 * @param {string} emoji - 页面emoji图标
 * @param {string} color - 渐变起始颜色
 * @param {string} desc - 功能描述
 */
function createPlaceholder(title, emoji, color, desc) {
  return {
    data: {
      title: title,
      emoji: emoji,
      color: color,
      desc: desc || '功能即将上线，敬请期待'
    },
    onShareAppMessage() {
      return {
        title: title + ' - 万能工具箱',
        path: '/pages/index/index'
      };
    }
  };
}

module.exports = { createPlaceholder };
