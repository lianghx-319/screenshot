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
    var height;
    height = width * 1334 / 750;
    shareMod.style.height = height + 'px';

    screenshot('.shareMod', {
      success: function () {
        $shareTip.animate({ opacity: 1 }, 1500, 'ease', function () {
          $(shareMod).remove();
          $loading.remove();
          clearInterval(timer);
        });
      }
    });
  })(kitCore.qrcode({
    text: 'https://vipc.cn/act/quiz/fc49aa19-a2aa-4c3b-8597-6411ebe39719?isShare=1&from_uid=599f985d1469540017fed561',
    height: 200,
    width: 200,
    correctLevel: 0
  }));
});