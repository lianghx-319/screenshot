VIPC.$(function () {
  var kitCore = VIPC.kitCore;
  var screenshot = kitCore.screenshot;
  var kitUI = VIPC.kitUI;
  var quiz = VIPC.Quiz;
  var api = new quiz.API();

  var $body = $('body');
  var $share = $body.find('.shareMod');
  var $banner = $share.find('.banner');
  var $userName = $share.find('.text.name');
  var $shareText = $share.find('.text.shareText');
  var $qrcodeText = $share.find('.qrcodeText');
  var $loading = $body.find('.load');
  var $shareTip = $body.find('.shareTop');

  var id = $body.attr('data-id');


  var counter = 0;
  var text = '正在生成图片';
  var timer = setInterval(function () {
    counter++;
    if (counter > 3) {
      counter = 0;
      text = '正在生成图片'
    } else {
      text += ' .';
    }
    $loading.html(text);
  }, 200);

  (function (qrcodeElement) {
    $('.qrcode').attr('data-src', qrcodeElement.toDataURL("image/png"));
    // console.log(qrcodeElement.toDataURL("image/png"));
    var shareMod = document.getElementsByClassName('shareMod')[0];
    var width = document.body.clientWidth || document.documentElement.clientWidth;
    width = width > 440 ? 440 : width;
    var height = document.body.clientHeight || document.documentElement.clientHeight;
    var expectedHeight = width * 1334 / 750;
    console.log(expectedHeight);
    if (expectedHeight > height) {
      console.log(1)
      var _width = height * (750 / 1334);
      if (_width > 440) {
        _width = 440
      }
      $('html').css('font-size', _width / 7.5);
      shareMod.style.height = height + 'px';
      shareMod.style.width = _width + 'px';
    } else {
      shareMod.style.height = expectedHeight + 'px';
    }

    screenshot('.shareMod', {
      success: function () {
        $(shareMod).remove();
        $shareTip.animate({ opacity: 1 }, 1500, 'ease', function () {
          $loading.remove();
          clearInterval(timer);
        });
      },
      removeContainer: true
    });
  })(kitCore.qrcode({
    text: 'https://vipc.cn/act/quiz/fc49aa19-a2aa-4c3b-8597-6411ebe39719?isShare=1&from_uid=599f985d1469540017fed561',
    height: 200,
    width: 200,
    correctLevel: 0
  }));
});