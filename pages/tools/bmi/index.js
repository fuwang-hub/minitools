var analytics = require('../../../utils/analytics');
// pages/tools/bmi/index.js
Page({
  onLoad: function() {
    analytics.trackPage('bmi');
    analytics.trackToolUse('bmi');
  },
  data: {
    gender: 'male',
    height: '',
    weight: '',
    age: '',
    result: null
  },

  setGender: function (e) { this.setData({ gender: e.currentTarget.dataset.g, result: null }); },
  onHeightInput: function (e) { this.setData({ height: e.detail.value }); },
  onWeightInput: function (e) { this.setData({ weight: e.detail.value }); },
  onAgeInput: function (e) { this.setData({ age: e.detail.value }); },

  calculate: function () {
    var h = parseFloat(this.data.height);
    var w = parseFloat(this.data.weight);
    var age = parseInt(this.data.age);
    var g = this.data.gender;

    if (!h || !w || h <= 0 || w <= 0) {
      wx.showToast({ title: '请输入身高体重', icon: 'none' }); return;
    }

    var hm = h / 100;
    // BMI
    var bmi = w / (hm * hm);
    var bmiLevel, bmiColor, bmiEmoji;
    if (bmi < 18.5) { bmiLevel = '偏瘦'; bmiColor = '#60a5fa'; bmiEmoji = '🥶'; }
    else if (bmi < 24) { bmiLevel = '正常'; bmiColor = '#34d399'; bmiEmoji = '😊'; }
    else if (bmi < 28) { bmiLevel = '偏胖'; bmiColor = '#fbbf24'; bmiEmoji = '😅'; }
    else { bmiLevel = '肥胖'; bmiColor = '#f87171'; bmiEmoji = '😰'; }

    // 理想体重(Broca改良法)
    var idealWeight = g === 'male' ? (h - 100) * 0.9 : (h - 100) * 0.9 - 2.5;
    var weightDiff = w - idealWeight;
    var weightAdvice = '';
    if (weightDiff > 5) weightAdvice = '建议减重 ' + weightDiff.toFixed(1) + 'kg';
    else if (weightDiff < -5) weightAdvice = '建议增重 ' + Math.abs(weightDiff).toFixed(1) + 'kg';
    else weightAdvice = '体重在理想范围内 👍';

    // 体脂率（US Navy / BMI估算法）
    var bodyFat;
    if (age > 0) {
      if (g === 'male') bodyFat = 1.2 * bmi + 0.23 * age - 16.2;
      else bodyFat = 1.2 * bmi + 0.23 * age - 5.4;
    } else {
      if (g === 'male') bodyFat = 1.2 * bmi - 10.8;
      else bodyFat = 1.2 * bmi - 0.8;
    }
    if (bodyFat < 3) bodyFat = 3;
    var fatLevel, fatColor;
    if (g === 'male') {
      if (bodyFat < 12) { fatLevel = '偏低'; fatColor = '#60a5fa'; }
      else if (bodyFat < 20) { fatLevel = '正常'; fatColor = '#34d399'; }
      else if (bodyFat < 25) { fatLevel = '偏高'; fatColor = '#fbbf24'; }
      else { fatLevel = '过高'; fatColor = '#f87171'; }
    } else {
      if (bodyFat < 20) { fatLevel = '偏低'; fatColor = '#60a5fa'; }
      else if (bodyFat < 28) { fatLevel = '正常'; fatColor = '#34d399'; }
      else if (bodyFat < 33) { fatLevel = '偏高'; fatColor = '#fbbf24'; }
      else { fatLevel = '过高'; fatColor = '#f87171'; }
    }

    // 基础代谢率(Mifflin-St Jeor)
    var bmr;
    var a = age > 0 ? age : 25;
    if (g === 'male') bmr = 10 * w + 6.25 * h - 5 * a + 5;
    else bmr = 10 * w + 6.25 * h - 5 * a - 161;

    // 每日饮水量
    var water = w * 35; // ml

    // BMI 标尺位置 (14-35范围映射到0-100%)
    var bmiPos = Math.max(0, Math.min(100, (bmi - 14) / (35 - 14) * 100));

    this.setData({
      result: {
        bmi: bmi.toFixed(1),
        bmiLevel: bmiLevel,
        bmiColor: bmiColor,
        bmiEmoji: bmiEmoji,
        bmiPos: bmiPos.toFixed(1),
        idealWeight: idealWeight.toFixed(1),
        weightDiff: weightDiff.toFixed(1),
        weightAdvice: weightAdvice,
        bodyFat: bodyFat.toFixed(1),
        fatLevel: fatLevel,
        fatColor: fatColor,
        bmr: Math.round(bmr),
        tdee_low: Math.round(bmr * 1.2),
        tdee_mid: Math.round(bmr * 1.55),
        tdee_high: Math.round(bmr * 1.9),
        water: Math.round(water),
        waterCups: Math.round(water / 250)
      }
    });
  },

  onShareAppMessage: function () {
    analytics.trackShare('friend', 'bmi');
    return { title: 'BMI健康计算器 - 了解你的身体指标', path: '/pages/tools/bmi/index' };
  }
});
