// pages/tools/weather/index.js
// 高德天气 API - 个人开发者 30万次/天 免费
// 注册地址: https://console.amap.com
// 1. 注册账号 → 控制台 → 应用管理 → 创建应用 → 添加Key（服务平台选"Web服务"）
// 2. 将Key填入下方 AMAP_KEY
var AMAP_KEY = '547409fc04fb337c94c10429fe979fb3';

// 天气图标映射（高德天气文字 → emoji）
var WEATHER_ICONS = {
  '晴': '☀️', '少云': '🌤️', '晴间多云': '⛅', '多云': '⛅', '阴': '☁️',
  '有风': '🌬️', '平静': '🌤️', '微风': '🌤️', '和风': '🌤️', '清风': '🌬️',
  '强风': '💨', '疾风': '💨', '大风': '💨', '烈风': '💨', '风暴': '🌪️',
  '狂爆风': '🌪️', '飓风': '🌪️', '龙卷风': '🌪️',
  '霾': '😷', '中度霾': '😷', '重度霾': '😷', '严重霾': '😷',
  '阵雨': '🌦️', '雷阵雨': '⛈️', '雷阵雨并伴有冰雹': '⛈️',
  '小雨': '🌧️', '中雨': '🌧️', '大雨': '🌧️', '暴雨': '🌧️', '大暴雨': '🌧️', '特大暴雨': '🌧️',
  '强阵雨': '🌧️', '强雷阵雨': '⛈️', '极端降雨': '🌧️',
  '毛毛雨': '🌦️', '细雨': '🌦️', '小雨-中雨': '🌧️', '中雨-大雨': '🌧️',
  '大雨-暴雨': '🌧️', '暴雨-大暴雨': '🌧️', '大暴雨-特大暴雨': '🌧️',
  '冻雨': '🌧️',
  '雨夹雪': '🌨️', '阵雪': '🌨️', '小雪': '🌨️', '中雪': '❄️', '大雪': '❄️', '暴雪': '❄️',
  '小雪-中雪': '🌨️', '中雪-大雪': '❄️', '大雪-暴雪': '❄️',
  '浮尘': '😷', '扬沙': '😷', '沙尘暴': '😷', '强沙尘暴': '😷',
  '雾': '🌫️', '浓雾': '🌫️', '强浓雾': '🌫️', '轻雾': '🌫️', '大雾': '🌫️', '特强浓雾': '🌫️',
  '热': '🔥', '冷': '🥶', '未知': '🌤️'
};

// 天气背景色映射
var WEATHER_BG = {
  '晴': ['#FF6B35', '#FF8C42'],
  '多云': ['#5B86E5', '#36D1DC'],
  '少云': ['#5B86E5', '#36D1DC'],
  '阴': ['#616161', '#9BC5C3'],
  '雨': ['#2C3E50', '#3498DB'],
  '小雨': ['#4A6FA5', '#6B93D6'],
  '中雨': ['#2C3E50', '#3498DB'],
  '大雨': ['#1a2a3a', '#2980B9'],
  '暴雨': ['#0d1b2a', '#1B4F72'],
  '雷阵雨': ['#2C3E50', '#4A69BD'],
  '阵雨': ['#4A6FA5', '#6B93D6'],
  '雪': ['#83a4d4', '#b6fbff'],
  '小雪': ['#83a4d4', '#b6fbff'],
  '大雪': ['#5f7ea8', '#b6fbff'],
  '雾': ['#757F9A', '#D7DDE8'],
  '霾': ['#8e9eab', '#eef2f3'],
  '沙尘': ['#c2956b', '#e8c99b']
};

// 城市编码表 - 高德使用 adcode
var CITIES = [
  { name: '北京', adcode: '110000' },
  { name: '上海', adcode: '310000' },
  { name: '广州', adcode: '440100' },
  { name: '深圳', adcode: '440300' },
  { name: '杭州', adcode: '330100' },
  { name: '成都', adcode: '510100' },
  { name: '武汉', adcode: '420100' },
  { name: '南京', adcode: '320100' },
  { name: '重庆', adcode: '500000' },
  { name: '西安', adcode: '610100' },
  { name: '天津', adcode: '120000' },
  { name: '苏州', adcode: '320500' },
  { name: '长沙', adcode: '430100' },
  { name: '郑州', adcode: '410100' },
  { name: '东莞', adcode: '441900' },
  { name: '青岛', adcode: '370200' },
  { name: '沈阳', adcode: '210100' },
  { name: '大连', adcode: '210200' },
  { name: '厦门', adcode: '350200' },
  { name: '福州', adcode: '350100' },
  { name: '昆明', adcode: '530100' },
  { name: '哈尔滨', adcode: '230100' },
  { name: '济南', adcode: '370100' },
  { name: '珠海', adcode: '440400' },
  { name: '佛山', adcode: '440600' },
  { name: '合肥', adcode: '340100' },
  { name: '无锡', adcode: '320200' },
  { name: '宁波', adcode: '330200' },
  { name: '贵阳', adcode: '520100' },
  { name: '南宁', adcode: '450100' },
  { name: '拉萨', adcode: '540100' },
  { name: '乌鲁木齐', adcode: '650100' },
  { name: '兰州', adcode: '620100' },
  { name: '海口', adcode: '460100' },
  { name: '三亚', adcode: '460200' },
  { name: '太原', adcode: '140100' },
  { name: '石家庄', adcode: '130100' },
  { name: '南昌', adcode: '360100' },
  { name: '长春', adcode: '220100' },
  { name: '呼和浩特', adcode: '150100' }
];

// 风力等级描述
var WIND_LEVELS = {
  '0': '无风', '1': '软风', '2': '轻风', '3': '微风',
  '4': '和风', '5': '清风', '6': '强风', '7': '疾风',
  '8': '大风', '9': '烈风', '10': '暴风', '11': '狂风', '12': '飓风'
};

function getWeatherIcon(text) {
  if (!text) return '🌤️';
  if (WEATHER_ICONS[text]) return WEATHER_ICONS[text];
  // 模糊匹配
  var keys = Object.keys(WEATHER_ICONS);
  for (var i = 0; i < keys.length; i++) {
    if (text.indexOf(keys[i]) >= 0) return WEATHER_ICONS[keys[i]];
  }
  return '🌤️';
}

function getWeatherBgGradient(text) {
  if (!text) return 'linear-gradient(180deg, #5B86E5, #36D1DC)';
  var keys = Object.keys(WEATHER_BG);
  for (var i = 0; i < keys.length; i++) {
    if (text.indexOf(keys[i]) >= 0) {
      return 'linear-gradient(180deg, ' + WEATHER_BG[keys[i]][0] + ', ' + WEATHER_BG[keys[i]][1] + ')';
    }
  }
  return 'linear-gradient(180deg, #5B86E5, #36D1DC)';
}

function getWeatherBgColor(text) {
  if (!text) return '#5B86E5';
  var keys = Object.keys(WEATHER_BG);
  for (var i = 0; i < keys.length; i++) {
    if (text.indexOf(keys[i]) >= 0) return WEATHER_BG[keys[i]][0];
  }
  return '#5B86E5';
}

function getAqiLevel(aqi) {
  var num = parseInt(aqi) || 0;
  if (num <= 50) return { text: '优', color: '#00E400', bg: 'rgba(0,228,0,0.15)' };
  if (num <= 100) return { text: '良', color: '#FFFF00', bg: 'rgba(255,255,0,0.15)' };
  if (num <= 150) return { text: '轻度', color: '#FF7E00', bg: 'rgba(255,126,0,0.15)' };
  if (num <= 200) return { text: '中度', color: '#FF0000', bg: 'rgba(255,0,0,0.15)' };
  if (num <= 300) return { text: '重度', color: '#8F3F97', bg: 'rgba(143,63,151,0.15)' };
  return { text: '严重', color: '#7E0023', bg: 'rgba(126,0,35,0.15)' };
}

// 生成逐小时预报（高德免费版不提供逐小时，基于实况模拟）
function generateHourly(nowTemp, nowWeather, forecastDay, forecastNight) {
  var hours = [];
  var now = new Date();
  var currentHour = now.getHours();
  var tempNow = parseInt(nowTemp) || 25;
  var dayHigh = parseInt(forecastDay) || tempNow + 3;
  var dayLow = parseInt(forecastNight) || tempNow - 5;

  for (var i = 0; i < 24; i++) {
    var h = (currentHour + i) % 24;
    var hourStr = (h < 10 ? '0' : '') + h + ':00';
    // 模拟温度变化曲线：白天高、夜晚低
    var ratio;
    if (h >= 6 && h <= 14) {
      ratio = (h - 6) / 8; // 6点到14点升温
    } else if (h > 14 && h <= 22) {
      ratio = 1 - (h - 14) / 8; // 14点到22点降温
    } else {
      ratio = 0; // 夜间最低
    }
    var temp = Math.round(dayLow + (dayHigh - dayLow) * ratio);
    var weather = i === 0 ? nowWeather : (ratio > 0.5 ? nowWeather : nowWeather);
    hours.push({
      time: i === 0 ? '现在' : hourStr,
      temp: String(temp),
      icon: getWeatherIcon(weather),
      text: weather
    });
  }
  return hours;
}

// 根据日期获取星期几
function getWeekday(dateStr) {
  var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var today = new Date();
  var todayStr = today.getFullYear() + '-' +
    ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' +
    (today.getDate() < 10 ? '0' : '') + today.getDate();
  var tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  var tomorrowStr = tomorrow.getFullYear() + '-' +
    ((tomorrow.getMonth() + 1) < 10 ? '0' : '') + (tomorrow.getMonth() + 1) + '-' +
    (tomorrow.getDate() < 10 ? '0' : '') + tomorrow.getDate();

  if (dateStr === todayStr) return '今天';
  if (dateStr === tomorrowStr) return '明天';
  var d = new Date(dateStr.replace(/-/g, '/'));
  return weekdays[d.getDay()];
}

// 根据城市和月份估算日出日落
function estimateSunrise(month) {
  var sunriseTable = [7, 7, 6, 6, 5, 5, 6, 6, 6, 6, 6, 7];
  var sunsetTable  = [18, 18, 18, 19, 19, 19, 19, 19, 18, 18, 17, 17];
  var riseH = sunriseTable[month] || 6;
  var setH = sunsetTable[month] || 18;
  var riseM = Math.floor(Math.random() * 30) + 10;
  var setM = Math.floor(Math.random() * 30) + 15;
  return {
    sunrise: (riseH < 10 ? '0' : '') + riseH + ':' + (riseM < 10 ? '0' : '') + riseM,
    sunset: (setH < 10 ? '0' : '') + setH + ':' + (setM < 10 ? '0' : '') + setM
  };
}

// 根据天气生成生活指数
function generateIndices(weather, temp, humidity, windpower) {
  var t = parseInt(temp) || 25;
  var h = parseInt(humidity) || 60;
  var w = parseInt(windpower) || 3;
  var isRain = (weather || '').indexOf('雨') >= 0;
  var isSnow = (weather || '').indexOf('雪') >= 0;
  var isFog = (weather || '').indexOf('雾') >= 0 || (weather || '').indexOf('霾') >= 0;
  var isSunny = (weather || '').indexOf('晴') >= 0;

  var indices = [];

  // 穿衣指数
  var dress;
  if (t >= 30) dress = { category: '炎热', text: '建议穿短衫、短裤等清凉夏装' };
  else if (t >= 25) dress = { category: '热', text: '建议穿棉麻衫、短裙等透气衣物' };
  else if (t >= 20) dress = { category: '舒适', text: '建议穿长袖衬衫、薄外套' };
  else if (t >= 15) dress = { category: '较冷', text: '建议穿毛衣、风衣等保暖衣物' };
  else if (t >= 5) dress = { category: '冷', text: '建议穿棉衣、羽绒服等厚实衣物' };
  else dress = { category: '严寒', text: '建议穿厚羽绒服、帽子围巾手套' };
  indices.push({ name: '穿衣', emoji: '👔', category: dress.category, text: dress.text });

  // 运动指数
  var sport;
  if (isRain || isSnow) sport = { category: '不宜', text: '天气不佳，建议在室内运动' };
  else if (t > 35 || t < 0) sport = { category: '不宜', text: '温度极端，不适合户外运动' };
  else if (isFog) sport = { category: '不宜', text: '空气质量差，建议减少户外活动' };
  else if (w > 5) sport = { category: '较不宜', text: '风力较大，户外运动需注意安全' };
  else if (t >= 15 && t <= 28) sport = { category: '适宜', text: '天气适宜，适合户外锻炼' };
  else sport = { category: '较适宜', text: '可适量进行户外运动' };
  indices.push({ name: '运动', emoji: '🏃', category: sport.category, text: sport.text });

  // 洗车指数
  var wash;
  if (isRain) wash = { category: '不宜', text: '有降雨，洗车会被淋湿' };
  else if (isFog) wash = { category: '不宜', text: '空气质量差，洗车容易弄脏' };
  else if (w > 5) wash = { category: '不宜', text: '风力大，洗车后容易沾灰' };
  else if (isSunny && w <= 3) wash = { category: '适宜', text: '天气晴好，非常适合洗车' };
  else wash = { category: '较适宜', text: '天气尚可，可以洗车' };
  indices.push({ name: '洗车', emoji: '🚗', category: wash.category, text: wash.text });

  // 紫外线指数
  var uv;
  if (isRain || isFog) uv = { category: '弱', text: '紫外线较弱，无需特别防护' };
  else if (isSunny && t > 30) uv = { category: '很强', text: '紫外线很强，外出需涂抹防晒霜' };
  else if (isSunny) uv = { category: '强', text: '紫外线较强，建议做好防晒措施' };
  else uv = { category: '中等', text: '紫外线中等，出门可适当防护' };
  indices.push({ name: '紫外线', emoji: '☀️', category: uv.category, text: uv.text });

  // 感冒指数
  var cold;
  if (t < 5 || (t < 15 && h > 80)) cold = { category: '易发', text: '昼夜温差大，注意增减衣物' };
  else if (t < 15) cold = { category: '较易发', text: '气温较低，注意保暖防寒' };
  else if (t >= 15 && t <= 25 && h < 70) cold = { category: '少发', text: '天气舒适，感冒发生概率低' };
  else cold = { category: '较少发', text: '天气尚可，注意防范' };
  indices.push({ name: '感冒', emoji: '🤧', category: cold.category, text: cold.text });

  // 旅游指数
  var travel;
  if (isRain || isSnow) travel = { category: '较不宜', text: '天气不佳，出行注意安全' };
  else if (t >= 15 && t <= 28 && isSunny) travel = { category: '非常适宜', text: '天气晴好，非常适合出游' };
  else if (t >= 10 && t <= 30) travel = { category: '适宜', text: '天气不错，适合外出游玩' };
  else travel = { category: '一般', text: '天气一般，出行需做好准备' };
  indices.push({ name: '旅游', emoji: '🏖️', category: travel.category, text: travel.text });

  return indices;
}

Page({
  data: {
    configured: false,
    loading: true,
    error: '',

    cityName: '深圳',
    cityAdcode: '440300',
    showCityPicker: false,
    searchKey: '',
    filteredCities: [],

    // 实时天气
    now: null,
    bgStyle: 'background: linear-gradient(180deg, #5B86E5, #36D1DC);',
    bgColor: '#5B86E5',
    weatherIcon: '🌤️',
    aqiInfo: null,

    // 逐小时
    hourly: [],

    // 多日预报
    daily: [],
    tempRange: { min: 0, max: 40 },

    // 生活指数
    indices: [],

    // 日出日落
    sunrise: '06:30',
    sunset: '18:30'
  },

  onLoad: function () {
    if (!AMAP_KEY) {
      this.setData({
        configured: false,
        loading: false,
        error: '请先配置高德地图 API Key'
      });
      return;
    }
    this.setData({ configured: true });

    // 优先读取缓存，快速渲染
    var app = getApp();
    var cached = app.getCache ? app.getCache('weather_' + this.data.cityAdcode) : null;
    if (cached) {
      this.setData(cached);
      this.setData({ loading: false });
    }
    this.getLocation();
  },

  onPullDownRefresh: function () {
    // 下拉刷新清除缓存
    var app = getApp();
    if (app.removeCache) {
      app.removeCache('weather_' + this.data.cityAdcode);
    }
    this.loadWeather();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage: function () {
    var now = this.data.now;
    return {
      title: this.data.cityName + ' ' + (now ? now.temperature + '°C ' + now.weather : '天气预报'),
      path: '/pages/tools/weather/index'
    };
  },

  // GPS 定位
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',  // 高德使用 gcj02 坐标系
      success: function (res) {
        that.reverseGeocode(res.longitude, res.latitude);
      },
      fail: function () {
        that.loadWeather();
      }
    });
  },

  // 逆地理编码：经纬度 → 城市名+adcode
  reverseGeocode: function (lng, lat) {
    var that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: AMAP_KEY,
        location: lng.toFixed(6) + ',' + lat.toFixed(6),
        extensions: 'base'
      },
      success: function (res) {
        if (res.data && res.data.status === '1' && res.data.regeocode) {
          var comp = res.data.regeocode.addressComponent;
          var cityName = comp.district || comp.city || comp.province || '深圳';
          var adcode = comp.adcode || '440300';
          // 去掉"市"、"区"后缀便于显示
          cityName = cityName.replace(/市$/, '').replace(/区$/, '');
          that.setData({
            cityName: cityName,
            cityAdcode: adcode
          });
        }
        that.loadWeather();
      },
      fail: function () {
        that.loadWeather();
      }
    });
  },

  // 加载天气数据
  loadWeather: function () {
    var that = this;
    this.setData({ loading: true, error: '' });

    var adcode = this.data.cityAdcode;
    var done = 0;
    var total = 2; // 实况 + 预报

    function checkDone() {
      done++;
      if (done >= total) {
        that.setData({ loading: false });
      }
    }

    // 1. 实况天气
    this.fetchLive(adcode, checkDone);
    // 2. 预报天气
    this.fetchForecast(adcode, checkDone);
  },

  // 获取实况天气
  fetchLive: function (adcode, cb) {
    var that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/weather/weatherInfo',
      data: {
        key: AMAP_KEY,
        city: adcode,
        extensions: 'base',
        output: 'JSON'
      },
      success: function (res) {
        if (res.data && res.data.status === '1' && res.data.lives && res.data.lives.length > 0) {
          var live = res.data.lives[0];
          var weather = live.weather || '晴';
          var bgGradient = getWeatherBgGradient(weather);
          var bgColor = getWeatherBgColor(weather);
          var icon = getWeatherIcon(weather);

          // 体感温度（简单估算：湿度高+高温→体感更热，湿度高+低温→体感更冷）
          var temp = parseInt(live.temperature) || 25;
          var hum = parseInt(live.humidity) || 60;
          var feelsLike = temp;
          if (temp > 25 && hum > 60) feelsLike = temp + Math.round((hum - 60) / 15);
          else if (temp < 10 && parseInt(live.windpower) > 3) feelsLike = temp - 2;

          // 风力描述
          var windDesc = live.winddirection + '风 ' + live.windpower + '级';

          // 城市名
          var displayName = live.city || that.data.cityName;
          displayName = displayName.replace(/市$/, '');

          // 生成生活指数
          var indices = generateIndices(weather, live.temperature, live.humidity, live.windpower);

          that.setData({
            now: {
              temperature: live.temperature,
              weather: weather,
              humidity: live.humidity,
              windDirection: live.winddirection,
              windPower: live.windpower,
              windDesc: windDesc,
              feelsLike: String(feelsLike),
              reportTime: (live.reporttime || '').substring(11, 16),
              province: live.province,
              city: live.city
            },
            weatherIcon: icon,
            bgStyle: 'background: ' + bgGradient + ';',
            bgColor: bgColor,
            cityName: displayName,
            indices: indices
          });

          // 缓存天气数据（30分钟）
          var app = getApp();
          if (app.setCache) {
            app.setCache('weather_' + adcode, {
              now: that.data.now,
              weatherIcon: icon,
              bgStyle: 'background: ' + bgGradient + ';',
              bgColor: bgColor,
              cityName: displayName,
              indices: indices
            }, 1800000);
          }

        } else {
          var errMsg = '获取天气失败';
          if (res.data && res.data.info) errMsg += '：' + res.data.info;
          that.setData({ error: errMsg });
        }
      },
      fail: function (err) {
        that.setData({ error: '网络请求失败' });
      },
      complete: cb
    });
  },

  // 获取预报天气（高德提供未来4天预报）
  fetchForecast: function (adcode, cb) {
    var that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/weather/weatherInfo',
      data: {
        key: AMAP_KEY,
        city: adcode,
        extensions: 'all',
        output: 'JSON'
      },
      success: function (res) {
        if (res.data && res.data.status === '1' && res.data.forecasts && res.data.forecasts.length > 0) {
          var forecast = res.data.forecasts[0];
          var casts = forecast.casts || [];

          var minT = 100, maxT = -100;
          var daily = casts.map(function (d) {
            var hi = parseInt(d.daytemp) || 30;
            var lo = parseInt(d.nighttemp) || 20;
            if (hi > maxT) maxT = hi;
            if (lo < minT) minT = lo;
            return {
              date: d.date,
              dateLabel: getWeekday(d.date),
              iconDay: getWeatherIcon(d.dayweather),
              iconNight: getWeatherIcon(d.nightweather),
              textDay: d.dayweather,
              textNight: d.nightweather,
              tempMax: String(hi),
              tempMin: String(lo),
              tempMaxNum: hi,
              tempMinNum: lo,
              windDay: d.daywind + d.daypower + '级',
              windNight: d.nightwind + d.nightpower + '级',
              humidity: ''
            };
          });

          // 计算温度条位置
          var range = maxT - minT || 1;
          daily = daily.map(function (d) {
            d.barLeft = ((d.tempMinNum - minT) / range * 100).toFixed(1);
            d.barWidth = ((d.tempMaxNum - d.tempMinNum) / range * 100).toFixed(1);
            return d;
          });

          // 日出日落
          var month = new Date().getMonth();
          var sun = estimateSunrise(month);

          that.setData({
            daily: daily,
            tempRange: { min: minT, max: maxT },
            sunrise: sun.sunrise,
            sunset: sun.sunset
          });

          // 生成逐小时预报
          var nowTemp = that.data.now ? that.data.now.temperature : '25';
          var nowWeather = that.data.now ? that.data.now.weather : '晴';
          var todayCast = casts[0] || {};
          var hourly = generateHourly(nowTemp, nowWeather, todayCast.daytemp, todayCast.nighttemp);
          that.setData({ hourly: hourly });
        }
      },
      complete: cb
    });
  },

  // 城市选择
  toggleCityPicker: function () {
    this.setData({
      showCityPicker: !this.data.showCityPicker,
      searchKey: '',
      filteredCities: CITIES
    });
  },

  _citySearchTimer: null,

  onCitySearch: function (e) {
    var key = e.detail.value || '';
    this.setData({ searchKey: key });
    if (!key) {
      this.setData({ filteredCities: CITIES });
      return;
    }
    // 防抖
    if (this._citySearchTimer) clearTimeout(this._citySearchTimer);
    var that = this;
    this._citySearchTimer = setTimeout(function() {
      var filtered = CITIES.filter(function (c) {
        return c.name.indexOf(key) >= 0;
      });
      that.setData({ filteredCities: filtered });
    }, 150);
  },

  selectCity: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var city = this.data.filteredCities[idx];
    if (!city) return;
    this.setData({
      cityName: city.name,
      cityAdcode: city.adcode,
      showCityPicker: false
    });
    this.loadWeather();
  },

  relocate: function () {
    this.setData({ showCityPicker: false });
    this.getLocation();
  }
});
