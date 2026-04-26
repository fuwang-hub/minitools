var analytics = require('../../../utils/analytics');
Page({
  onLoad: function() {
    analytics.trackPage('calculator');
    analytics.startStay('calculator');
    analytics.trackToolUse('calculator');
  },
  data: {
    display: '0',
    expression: '',
    operator: null,
    previousValue: null,
    waitingForOperand: false,
    activeOp: ''
  },

  onDigit: function(e) {
    var digit = e.currentTarget.dataset.digit;
    var display = this.data.display; var waitingForOperand = this.data.waitingForOperand;

    if (waitingForOperand) {
      this.setData({
        display: String(digit),
        waitingForOperand: false,
        activeOp: ''
      });
    } else {
      this.setData({
        display: display === '0' ? String(digit) : display + digit
      });
    }
  },

  onDot: function() {
    var display = this.data.display; var waitingForOperand = this.data.waitingForOperand;
    if (waitingForOperand) {
      this.setData({ display: '0.', waitingForOperand: false, activeOp: '' });
    } else if (display.indexOf('.') === -1) {
      this.setData({ display: display + '.' });
    }
  },

  onClear: function() {
    this.setData({
      display: '0',
      expression: '',
      operator: null,
      previousValue: null,
      waitingForOperand: false,
      activeOp: ''
    });
  },

  onToggleSign: function() {
    var display = this.data.display;
    if (display !== '0') {
      this.setData({
        display: display.charAt(0) === '-' ? display.substr(1) : '-' + display
      });
    }
  },

  onPercent: function() {
    var display = this.data.display;
    var val = parseFloat(display);
    if (val !== 0) {
      this.setData({ display: String(val / 100) });
    }
  },

  onOperator: function(e) {
    var nextOp = e.currentTarget.dataset.op;
    var display = this.data.display; var operator = this.data.operator; var previousValue = this.data.previousValue;
    var inputValue = parseFloat(display);

    if (previousValue !== null && operator && !this.data.waitingForOperand) {
      var result = this._calculate(previousValue, inputValue, operator);
      this.setData({
        display: this._formatResult(result),
        expression: this._formatResult(result) + ' ' + this._opSymbol(nextOp),
        previousValue: result,
        operator: nextOp,
        waitingForOperand: true,
        activeOp: nextOp
      });
    } else {
      this.setData({
        expression: display + ' ' + this._opSymbol(nextOp),
        previousValue: inputValue,
        operator: nextOp,
        waitingForOperand: true,
        activeOp: nextOp
      });
    }
  },

  onEquals: function() {
    var display = this.data.display; var operator = this.data.operator; var previousValue = this.data.previousValue;
    if (operator === null || previousValue === null) return;

    var inputValue = parseFloat(display);
    var result = this._calculate(previousValue, inputValue, operator);

    this.setData({
      display: this._formatResult(result),
      expression: previousValue + ' ' + this._opSymbol(operator) + ' ' + display + ' =',
      previousValue: null,
      operator: null,
      waitingForOperand: true,
      activeOp: ''
    });
  },

  _calculate: function(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  },

  _opSymbol: function(op) {
    var map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return map[op] || op;
  },

  _formatResult: function(val) {
    if (Number.isInteger(val)) return String(val);
    return String(Math.round(val * 100000000) / 100000000);
  }
});
