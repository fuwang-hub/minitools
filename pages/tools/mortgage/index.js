var analytics = require('../../../utils/analytics');
// pages/tools/mortgage/index.js
Page({
  data: {
    // 贷款类型: commercial/fund/combo
    loanType: 'commercial',
    loanTypes: [
      { key: 'commercial', name: '商业贷款' },
      { key: 'fund', name: '公积金贷款' },
      { key: 'combo', name: '组合贷款' }
    ],
    // 还款方式: equal_payment(等额本息) / equal_principal(等额本金)
    repayType: 'equal_payment',
    // 输入
    totalPrice: '',       // 房屋总价(万)
    downPaymentRate: 30,  // 首付比例
    downPaymentRates: [20, 30, 40, 50, 60, 70],
    loanAmount: '',       // 贷款金额(万) - 自动计算或手动输入
    loanYears: 30,        // 贷款年限
    yearOptions: [5, 10, 15, 20, 25, 30],
    commercialRate: '3.45', // 商贷利率
    fundRate: '2.85',       // 公积金利率
    // 组合贷
    comboCommercial: '',  // 商贷部分(万)
    comboFund: '',        // 公积金部分(万)
    // 结果
    result: null,
    showDetail: false,
    detailMonths: []
  },

  onLoad: function () {
    analytics.trackPage('mortgage');
    analytics.trackToolUse('mortgage');
    this.calcLoanAmount();
  },

  // 切换贷款类型
  switchLoanType: function (e) {
    this.setData({ loanType: e.currentTarget.dataset.type, result: null, showDetail: false });
    this.calcLoanAmount();
  },

  // 切换还款方式
  switchRepayType: function (e) {
    this.setData({ repayType: e.currentTarget.dataset.type, result: null, showDetail: false });
  },

  onTotalPriceInput: function (e) {
    this.setData({ totalPrice: e.detail.value });
    this.calcLoanAmount();
  },

  onDownPaymentChange: function (e) {
    this.setData({ downPaymentRate: this.data.downPaymentRates[e.detail.value] });
    this.calcLoanAmount();
  },

  onLoanAmountInput: function (e) {
    this.setData({ loanAmount: e.detail.value });
  },

  onYearsChange: function (e) {
    this.setData({ loanYears: this.data.yearOptions[e.detail.value], result: null, showDetail: false });
  },

  onCommercialRateInput: function (e) {
    this.setData({ commercialRate: e.detail.value });
  },

  onFundRateInput: function (e) {
    this.setData({ fundRate: e.detail.value });
  },

  onComboCommercialInput: function (e) {
    this.setData({ comboCommercial: e.detail.value });
  },

  onComboFundInput: function (e) {
    this.setData({ comboFund: e.detail.value });
  },

  calcLoanAmount: function () {
    var total = parseFloat(this.data.totalPrice);
    if (total > 0) {
      var loan = (total * (100 - this.data.downPaymentRate) / 100).toFixed(2);
      this.setData({ loanAmount: loan });
    }
  },

  // 核心计算
  calculate: function () {
    var type = this.data.loanType;
    var repay = this.data.repayType;
    var months = this.data.loanYears * 12;

    if (type === 'combo') {
      var comAmt = parseFloat(this.data.comboCommercial);
      var fundAmt = parseFloat(this.data.comboFund);
      if (!comAmt || !fundAmt || comAmt <= 0 || fundAmt <= 0) {
        wx.showToast({ title: '请输入组合贷金额', icon: 'none' }); return;
      }
      var comRate = parseFloat(this.data.commercialRate) / 100 / 12;
      var fRate = parseFloat(this.data.fundRate) / 100 / 12;
      var r1 = this._calc(comAmt * 10000, comRate, months, repay);
      var r2 = this._calc(fundAmt * 10000, fRate, months, repay);
      this.setData({
        result: {
          totalLoan: ((comAmt + fundAmt) * 10000).toFixed(0),
          totalLoanWan: (comAmt + fundAmt).toFixed(2),
          monthlyPayment: (r1.monthlyFirst + r2.monthlyFirst).toFixed(2),
          monthlyLast: repay === 'equal_principal' ? (r1.monthlyLast + r2.monthlyLast).toFixed(2) : null,
          totalPayment: (r1.totalPayment + r2.totalPayment).toFixed(2),
          totalInterest: (r1.totalInterest + r2.totalInterest).toFixed(2),
          totalPaymentWan: ((r1.totalPayment + r2.totalPayment) / 10000).toFixed(2),
          totalInterestWan: ((r1.totalInterest + r2.totalInterest) / 10000).toFixed(2),
          repayType: repay === 'equal_payment' ? '等额本息' : '等额本金',
          isCombo: true,
          part1: { name: '商贷', monthly: r1.monthlyFirst.toFixed(2), interest: (r1.totalInterest / 10000).toFixed(2) },
          part2: { name: '公积金', monthly: r2.monthlyFirst.toFixed(2), interest: (r2.totalInterest / 10000).toFixed(2) }
        },
        showDetail: false
      });
    } else {
      var amount = parseFloat(this.data.loanAmount);
      if (!amount || amount <= 0) {
        wx.showToast({ title: '请输入贷款金额', icon: 'none' }); return;
      }
      var rateStr = type === 'fund' ? this.data.fundRate : this.data.commercialRate;
      var rate = parseFloat(rateStr) / 100 / 12;
      var r = this._calc(amount * 10000, rate, months, repay);
      this.setData({
        result: {
          totalLoan: (amount * 10000).toFixed(0),
          totalLoanWan: amount,
          monthlyPayment: r.monthlyFirst.toFixed(2),
          monthlyLast: repay === 'equal_principal' ? r.monthlyLast.toFixed(2) : null,
          totalPayment: r.totalPayment.toFixed(2),
          totalInterest: r.totalInterest.toFixed(2),
          totalPaymentWan: (r.totalPayment / 10000).toFixed(2),
          totalInterestWan: (r.totalInterest / 10000).toFixed(2),
          repayType: repay === 'equal_payment' ? '等额本息' : '等额本金',
          isCombo: false
        },
        showDetail: false
      });
    }
  },

  _calc: function (principal, monthlyRate, months, repayType) {
    if (repayType === 'equal_payment') {
      // 等额本息
      if (monthlyRate === 0) {
        var mp = principal / months;
        return { monthlyFirst: mp, monthlyLast: mp, totalPayment: principal, totalInterest: 0 };
      }
      var mp = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      var total = mp * months;
      return { monthlyFirst: mp, monthlyLast: mp, totalPayment: total, totalInterest: total - principal };
    } else {
      // 等额本金
      var principalPerMonth = principal / months;
      var firstMonth = principalPerMonth + principal * monthlyRate;
      var lastMonth = principalPerMonth + principalPerMonth * monthlyRate;
      var totalInterest = (principal * monthlyRate * (months + 1)) / 2;
      return { monthlyFirst: firstMonth, monthlyLast: lastMonth, totalPayment: principal + totalInterest, totalInterest: totalInterest };
    }
  },

  toggleDetail: function () {
    if (!this.data.result) return;
    if (this.data.showDetail) {
      this.setData({ showDetail: false });
      return;
    }
    // 生成还款明细（前12个月 + 最后1个月）
    var type = this.data.loanType;
    var repay = this.data.repayType;
    var months = this.data.loanYears * 12;
    var amount, rate;
    if (type === 'combo') {
      amount = (parseFloat(this.data.comboCommercial) + parseFloat(this.data.comboFund)) * 10000;
      rate = parseFloat(this.data.commercialRate) / 100 / 12; // 简化用商贷利率
    } else {
      amount = parseFloat(this.data.loanAmount) * 10000;
      var rateStr = type === 'fund' ? this.data.fundRate : this.data.commercialRate;
      rate = parseFloat(rateStr) / 100 / 12;
    }

    var details = [];
    var remaining = amount;
    for (var i = 1; i <= months; i++) {
      var interest, principal, payment;
      if (repay === 'equal_payment') {
        if (rate === 0) { payment = amount / months; interest = 0; principal = payment; }
        else {
          payment = amount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
          interest = remaining * rate;
          principal = payment - interest;
        }
      } else {
        principal = amount / months;
        interest = remaining * rate;
        payment = principal + interest;
      }
      remaining -= principal;
      if (remaining < 0) remaining = 0;

      if (i <= 12 || i === months) {
        details.push({
          month: i,
          payment: payment.toFixed(2),
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          remaining: remaining.toFixed(0)
        });
      } else if (i === 13) {
        details.push({ month: -1, payment: '...', principal: '...', interest: '...', remaining: '...' });
      }
    }
    this.setData({ detailMonths: details, showDetail: true });
  },

  onShareAppMessage: function () {
    analytics.trackShare('friend', 'mortgage');
    return { title: '房贷计算器 - 算算你的月供', path: '/pages/tools/mortgage/index' };
  }
});
