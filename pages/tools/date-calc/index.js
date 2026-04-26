var analytics = require('../../../utils/analytics');
const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function diffDays(d1, d2) {
  const t1 = new Date(d1.replace(/-/g, '/')).getTime();
  const t2 = new Date(d2.replace(/-/g, '/')).getTime();
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

function addDaysToDate(dateStr, days) {
  const d = new Date(dateStr.replace(/-/g, '/'));
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { date: y + '-' + m + '-' + dd, weekday: weekdays[d.getDay()] };
}

Page({
  data: {
    mode: 'diff',
    // diff
    startDate: today(),
    endDate: today(),
    diffResult: null,
    diffWeeks: 0,
    diffRemainDays: 0,
    // add
    baseDate: today(),
    addDays: 30,
    addResult: '',
    addWeekday: '',
    // countdown
    targetDate: today(),
    eventName: '',
    countdownDays: null,
    absCountdownDays: 0
  },

  onLoad() {
    this._calcDiff();
    this._calcAdd();
    this._calcCountdown();
  },

  switchMode(e) {
    this.setData({ mode: e.currentTarget.dataset.mode });
  },

  // === 日期差 ===
  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value });
    this._calcDiff();
  },
  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value });
    this._calcDiff();
  },
  _calcDiff() {
    const d = diffDays(this.data.startDate, this.data.endDate);
    const abs = Math.abs(d);
    this.setData({
      diffResult: abs,
      diffWeeks: Math.floor(abs / 7),
      diffRemainDays: abs % 7
    });
  },

  // === 推算 ===
  onBaseDateChange(e) {
    this.setData({ baseDate: e.detail.value });
    this._calcAdd();
  },
  onAddDaysChange(e) {
    this.setData({ addDays: Number(e.detail.value) || 0 });
    this._calcAdd();
  },
  _calcAdd() {
    const { baseDate, addDays: days } = this.data;
    const r = addDaysToDate(baseDate, days);
    this.setData({ addResult: r.date, addWeekday: r.weekday });
  },

  // === 倒计时 ===
  onTargetDateChange(e) {
    this.setData({ targetDate: e.detail.value });
    this._calcCountdown();
  },
  onEventNameChange(e) {
    this.setData({ eventName: e.detail.value });
  },
  _calcCountdown() {
    const d = diffDays(today(), this.data.targetDate);
    this.setData({ countdownDays: d, absCountdownDays: Math.abs(d) });
  }
});
