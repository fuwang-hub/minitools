// components/share-poster/share-poster.js
Component({
  properties: {
    show: { type: Boolean, value: false },
    posterData: { type: Object, value: {} }
    // posterData: { title, subtitle, emoji, result, desc, highlight, qrTip }
  },

  data: {
    posterReady: false,
    posterPath: ''
  },

  observers: {
    'show, posterData': function(show) {
      if (show && this.properties.posterData.title) {
        this.drawPoster();
      }
    }
  },

  methods: {
    drawPoster: function() {
      var that = this;
      var d = this.properties.posterData;
      var query = this.createSelectorQuery();
      query.select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec(function(res) {
          if (!res || !res[0] || !res[0].node) {
            // 降级：使用旧版canvas API
            that._drawLegacy(d);
            return;
          }
          var canvas = res[0].node;
          var ctx = canvas.getContext('2d');
          var dpr = wx.getSystemInfoSync().pixelRatio;
          var W = 600;
          var H = 900;
          canvas.width = W * dpr;
          canvas.height = H * dpr;
          ctx.scale(dpr, dpr);
          that._draw(ctx, d, W, H, canvas);
        });
    },

    _draw: function(ctx, d, W, H, canvas) {
      var that = this;

      // 背景
      var grd = ctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, '#4F6EF6');
      grd.addColorStop(1, '#6C8AFF');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // 白色卡片区域
      var cardX = 30, cardY = 60, cardW = W - 60, cardH = H - 180;
      ctx.fillStyle = '#FFFFFF';
      that._roundRect(ctx, cardX, cardY, cardW, cardH, 24);
      ctx.fill();

      // Emoji
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.emoji || '🎯', W / 2, cardY + 100);

      // 标题
      ctx.fillStyle = '#1A1A1A';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(d.title || '测试结果', W / 2, cardY + 160);

      // 副标题
      if (d.subtitle) {
        ctx.fillStyle = '#666666';
        ctx.font = '24px sans-serif';
        ctx.fillText(d.subtitle, W / 2, cardY + 200);
      }

      // 高亮结果（大字）
      if (d.result) {
        ctx.fillStyle = '#4F6EF6';
        ctx.font = 'bold 56px sans-serif';
        ctx.fillText(d.result, W / 2, cardY + 310);
      }

      // 高亮名称
      if (d.highlight) {
        ctx.fillStyle = '#1A1A1A';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(d.highlight, W / 2, cardY + 370);
      }

      // 描述文字（自动换行）
      if (d.desc) {
        ctx.fillStyle = '#666666';
        ctx.font = '22px sans-serif';
        var lines = that._wrapText(ctx, d.desc, cardW - 80);
        var startY = cardY + 430;
        lines.forEach(function(line, i) {
          if (i < 4) {
            ctx.fillText(line, W / 2, startY + i * 36);
          }
        });
      }

      // 分割线
      ctx.strokeStyle = '#EAEEF3';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX + 40, cardY + cardH - 120);
      ctx.lineTo(cardX + cardW - 40, cardY + cardH - 120);
      ctx.stroke();

      // 底部引导文字
      ctx.fillStyle = '#4F6EF6';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(d.qrTip || '长按识别小程序码，你也来测测！', W / 2, cardY + cardH - 70);

      // 小程序名
      ctx.fillStyle = '#999999';
      ctx.font = '20px sans-serif';
      ctx.fillText('— 万能工具箱 —', W / 2, cardY + cardH - 30);

      // 底部品牌
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('📱 万能工具箱', W / 2, H - 80);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '20px sans-serif';
      ctx.fillText('一个小程序，搞定日常所有小需求', W / 2, H - 45);

      // 导出图片
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvas: canvas,
          success: function(res) {
            that.setData({ posterReady: true, posterPath: res.tempFilePath });
          },
          fail: function() {
            that.setData({ posterReady: false });
          }
        });
      }, 200);
    },

    _drawLegacy: function(d) {
      var that = this;
      var ctx = wx.createCanvasContext('posterCanvasLegacy', this);
      var W = 600, H = 900;

      // 背景
      var grd = ctx.createLinearGradient(0, 0, W, H);
      grd.addColorStop(0, '#4F6EF6');
      grd.addColorStop(1, '#6C8AFF');
      ctx.setFillStyle(grd);
      ctx.fillRect(0, 0, W, H);

      // 白色卡片
      ctx.setFillStyle('#FFFFFF');
      ctx.fillRect(30, 60, W - 60, H - 180);

      // 标题
      ctx.setFillStyle('#1A1A1A');
      ctx.setFontSize(36);
      ctx.setTextAlign('center');
      ctx.fillText(d.title || '测试结果', W / 2, 160);

      // 结果
      if (d.result) {
        ctx.setFillStyle('#4F6EF6');
        ctx.setFontSize(56);
        ctx.fillText(d.result, W / 2, 350);
      }

      if (d.highlight) {
        ctx.setFillStyle('#1A1A1A');
        ctx.setFontSize(32);
        ctx.fillText(d.highlight, W / 2, 410);
      }

      // 底部
      ctx.setFillStyle('rgba(255,255,255,0.9)');
      ctx.setFontSize(26);
      ctx.fillText('📱 万能工具箱', W / 2, H - 80);

      ctx.draw(false, function() {
        wx.canvasToTempFilePath({
          canvasId: 'posterCanvasLegacy',
          success: function(res) {
            that.setData({ posterReady: true, posterPath: res.tempFilePath });
          }
        }, that);
      });
    },

    _roundRect: function(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    },

    _wrapText: function(ctx, text, maxWidth) {
      var lines = [];
      var current = '';
      for (var i = 0; i < text.length; i++) {
        var test = current + text[i];
        var metrics = ctx.measureText(test);
        if (metrics.width > maxWidth && current) {
          lines.push(current);
          current = text[i];
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);
      return lines;
    },

    savePoster: function() {
      var that = this;
      if (!this.data.posterPath) return;

      wx.saveImageToPhotosAlbum({
        filePath: this.data.posterPath,
        success: function() {
          wx.showToast({ title: '已保存到相册', icon: 'success' });
          that.triggerEvent('saved');
        },
        fail: function(err) {
          if (err.errMsg.indexOf('auth') >= 0) {
            wx.showModal({
              title: '需要权限',
              content: '请允许保存图片到相册',
              success: function(res) {
                if (res.confirm) wx.openSetting();
              }
            });
          }
        }
      });
    },

    closePoster: function() {
      this.setData({ posterReady: false, posterPath: '' });
      this.triggerEvent('close');
    }
  }
});
