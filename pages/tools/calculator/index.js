var analytics = require('../../../utils/analytics');
Page({
  onLoad: function() {
    analytics.trackPage('calculator');
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

  onDigit(e) {
    const digit = e.currentTarget.dataset.digit;
    const { display, waitingForOperand } = this.data;

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

  onDot() {
    const { display, waitingForOperand } = this.data;
    if (waitingForOperand) {
      this.setData({ display: '0.', waitingForOperand: false, activeOp: '' });
    } else if (display.indexOf('.') === -1) {
      this.setData({ display: display + '.' });
    }
  },

  onClear() {
    this.setData({
      display: '0',
      expression: '',
      operator: null,
      previousValue: null,
      waitingForOperand: false,
      activeOp: ''
    });
  },

  onToggleSign() {
    const { display } = this.data;
    if (display !== '0') {
      this.setData({
        display: display.charAt(0) === '-' ? display.substr(1) : '-' + display
      });
    }
  },

  onPercent() {
    const { display } = this.data;
    const val = parseFloat(display);
    if (val !== 0) {
      this.setData({ display: String(val / 100) });
    }
  },

  onOperator(e) {
    const nextOp = e.currentTarget.dataset.op;
    const { display, operator, previousValue } = this.data;
    const inputValue = parseFloat(display);

    if (previousValue !== null && operator && !this.data.waitingForOperand) {
      const result = this._calculate(previousValue, inputValue, operator);
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

  onEquals() {
    const { display, operator, previousValue } = this.data;
    if (operator === null || previousValue === null) return;

    const inputValue = parseFloat(display);
    const result = this._calculate(previousValue, inputValue, operator);

    this.setData({
      display: this._formatResult(result),
      expression: previousValue + ' ' + this._opSymbol(operator) + ' ' + display + ' =',
      previousValue: null,
      operator: null,
      waitingForOperand: true,
      activeOp: ''
    });
  },

  _calculate(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  },

  _opSymbol(op) {
    const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    return map[op] || op;
  },

  _formatResult(val) {
    if (Number.isInteger(val)) return String(val);
    return String(Math.round(val * 100000000) / 100000000);
  }
});
