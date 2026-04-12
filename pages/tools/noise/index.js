// pages/tools/noise/index.js
// 使用微信小程序 RecorderManager 获取音量
var LEVELS = [
  { min: 0, max: 30, label: '非常安静', emoji: '😴', color: '#10b981', desc: '图书馆、深夜卧室', bg: '#ecfdf5' },
  { min: 30, max: 50, label: '安静', emoji: '😊', color: '#34d399', desc: '轻声细语、办公室', bg: '#d1fae5' },
  { min: 50, max: 65, label: '一般', emoji: '😐', color: '#fbbf24', desc: '正常交谈、电视声', bg: '#fef3c7' },
  { min: 65, max: 80, label: '较吵', emoji: '😣', color: '#f97316', desc: '街道噪声、餐厅', bg: '#ffedd5' },
  { min: 80, max: 95, label: '嘈杂', emoji: '😫', color: '#ef4444', desc: '工厂车间、摩托车', bg: '#fee2e2' },
  { min: 95, max: 130, label: '极度嘈杂', emoji: '🤯', color: '#dc2626', desc: '喇叭、演唱会、可能损伤听力', bg: '#fecaca' }
];

function getLevel(db) {
  for (var i = 0; i < LEVELS.length; i++) {
    if (db >= LEVELS[i].min && db < LEVELS[i].max) return LEVELS[i];
  }
  return LEVELS[LEVELS.length - 1];
}

Page({
  data: {
    currentDb: 0,
    maxDb: 0,
    minDb: 999,
    avgDb: 0,
    level: LEVELS[0],
    isRecording: false,
    history: [],  // 最近60秒数据
    meterAngle: -45, // 表盘指针角度 (-45 ~ 225)
    duration: 0, // 已检测秒数
    durationText: '0秒'
  },

  _recorder: null,
  _timer: null,
  _samples: [],
  _frameCallback: null,

  onLoad: function () {
    this._recorder = wx.getRecorderManager();
    var that = this;

    this._recorder.onFrameRecorded(function (res) {
      if (res.frameBuffer) {
        // 从 PCM 数据计算 RMS 音量
        var data = new Int16Array(res.frameBuffer);
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
          sum += data[i] * data[i];
        }
        var rms = Math.sqrt(sum / data.length);
        // 转换为分贝 (参考值 32767 = 0dBFS, 映射到 SPL 约 30-100dB)
        var db = 0;
        if (rms > 0) {
          db = 20 * Math.log(rms) / Math.LN10;
          // 映射到实际分贝范围（简单线性映射）
          db = Math.max(20, Math.min(120, db * 1.2 + 10));
        }
        db = Math.round(db);

        that._samples.push(db);
        var maxDb = Math.max(that.data.maxDb, db);
        var minDb = Math.min(that.data.minDb, db);
        // 计算最近样本平均值
        var recent = that._samples.slice(-20);
        var avgSum = 0;
        for (var j = 0; j < recent.length; j++) avgSum += recent[j];
        var avgDb = Math.round(avgSum / recent.length);

        var level = getLevel(db);
        var angle = -45 + (db / 130) * 270; // 映射到 -45° ~ 225°
        if (angle > 225) angle = 225;

        // 历史记录（每秒1个点）
        var history = that.data.history;
        if (that._samples.length % 5 === 0) {
          history.push(db);
          if (history.length > 60) history = history.slice(-60);
        }

        var duration = that.data.duration;
        var durationText = duration < 60 ? duration + '秒' : Math.floor(duration / 60) + '分' + (duration % 60) + '秒';

        that.setData({
          currentDb: db,
          maxDb: maxDb,
          minDb: minDb === 999 ? db : minDb,
          avgDb: avgDb,
          level: level,
          meterAngle: angle,
          history: history,
          durationText: durationText
        });
      }
    });

    this._recorder.onStop(function () {
      that.setData({ isRecording: false });
    });

    this._recorder.onError(function (err) {
      wx.showToast({ title: '录音权限被拒绝', icon: 'none' });
      that.setData({ isRecording: false });
    });
  },

  startDetect: function () {
    this.setData({ maxDb: 0, minDb: 999, avgDb: 0, history: [], duration: 0, durationText: '0秒' });
    this._samples = [];

    this._recorder.start({
      duration: 600000,     // 最长10分钟
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'PCM',
      frameSize: 5          // 每5KB回调一次
    });

    var that = this;
    this._timer = setInterval(function () {
      that.setData({ duration: that.data.duration + 1 });
    }, 1000);

    this.setData({ isRecording: true });
  },

  stopDetect: function () {
    this._recorder.stop();
    clearInterval(this._timer);
    this.setData({ isRecording: false });
  },

  onUnload: function () {
    if (this.data.isRecording) {
      this._recorder.stop();
      clearInterval(this._timer);
    }
  },

  onShareAppMessage: function () {
    return { title: '噪音检测 - 实时分贝测量', path: '/pages/tools/noise/index' };
  }
});
