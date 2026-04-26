var analytics = require('../../../utils/analytics');
var categories = [
  {
    key: 'length', name: '长度',
    units: [
      { name: '米(m)', factor: 1 },
      { name: '千米(km)', factor: 1000 },
      { name: '厘米(cm)', factor: 0.01 },
      { name: '毫米(mm)', factor: 0.001 },
      { name: '英里(mi)', factor: 1609.344 },
      { name: '英尺(ft)', factor: 0.3048 },
      { name: '英寸(in)', factor: 0.0254 }
    ]
  },
  {
    key: 'weight', name: '重量',
    units: [
      { name: '千克(kg)', factor: 1 },
      { name: '克(g)', factor: 0.001 },
      { name: '毫克(mg)', factor: 0.000001 },
      { name: '吨(t)', factor: 1000 },
      { name: '磅(lb)', factor: 0.453592 },
      { name: '盎司(oz)', factor: 0.0283495 },
      { name: '斤', factor: 0.5 }
    ]
  },
  {
    key: 'temperature', name: '温度',
    units: [
      { name: '摄氏度(°C)', factor: 'C' },
      { name: '华氏度(°F)', factor: 'F' },
      { name: '开尔文(K)', factor: 'K' }
    ]
  },
  {
    key: 'area', name: '面积',
    units: [
      { name: '平方米(m²)', factor: 1 },
      { name: '平方千米(km²)', factor: 1000000 },
      { name: '公顷(ha)', factor: 10000 },
      { name: '亩', factor: 666.667 },
      { name: '平方英尺(ft²)', factor: 0.092903 }
    ]
  },
  {
    key: 'volume', name: '体积',
    units: [
      { name: '升(L)', factor: 1 },
      { name: '毫升(mL)', factor: 0.001 },
      { name: '立方米(m³)', factor: 1000 },
      { name: '加仑(gal)', factor: 3.78541 },
      { name: '品脱(pt)', factor: 0.473176 }
    ]
  },
  {
    key: 'speed', name: '速度',
    units: [
      { name: '米/秒(m/s)', factor: 1 },
      { name: '千米/时(km/h)', factor: 0.277778 },
      { name: '英里/时(mph)', factor: 0.44704 },
      { name: '节(knot)', factor: 0.514444 }
    ]
  }
];

Page({
  onLoad: function() {
    analytics.trackPage('converter');
    analytics.startStay('converter');
    analytics.trackToolUse('converter');
  },
  data: {
    categories,
    activeTab: 0,
    currentUnits: categories[0].units,
    fromIndex: 0,
    toIndex: 1,
    fromValue: '',
    toValue: '0'
  },

  onTabChange: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index,
      currentUnits: categories[index].units,
      fromIndex: 0,
      toIndex: 1,
      fromValue: '',
      toValue: '0'
    });
  },

  onFromChange: function(e) {
    this.setData({ fromIndex: Number(e.detail.value) });
    this._convert();
  },

  onToChange: function(e) {
    this.setData({ toIndex: Number(e.detail.value) });
    this._convert();
  },

  onInputChange: function(e) {
    this.setData({ fromValue: e.detail.value });
    this._convert();
  },

  onSwap: function() {
    var fromIndex = this.data.fromIndex; var toIndex = this.data.toIndex; var toValue = this.data.toValue;
    this.setData({
      fromIndex: toIndex,
      toIndex: fromIndex,
      fromValue: toValue
    });
    this._convert();
  },

  _convert: function() {
    var { currentUnits, fromIndex, toIndex, fromValue, activeTab } = this.data;
    var val = parseFloat(fromValue);
    if (isNaN(val)) {
      this.setData({ toValue: '0' });
      return;
    }

    var from = currentUnits[fromIndex];
    var to = currentUnits[toIndex];

    var result;
    if (categories[activeTab].key === 'temperature') {
      result = this._convertTemp(val, from.factor, to.factor);
    } else {
      result = val * from.factor / to.factor;
    }

    this.setData({
      toValue: Number.isInteger(result) ? String(result) : result.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
    });
  },

  _convertTemp: function(val, from, to) {
    // 先转为摄氏度
    var celsius;
    if (from === 'C') celsius = val;
    else if (from === 'F') celsius = (val - 32) * 5 / 9;
    else celsius = val - 273.15;

    // 从摄氏度转为目标
    if (to === 'C') return celsius;
    if (to === 'F') return celsius * 9 / 5 + 32;
    return celsius + 273.15;
  }
});
