(function () {
  var screenshot = function (selector, options) {
    var parent = typeof selector === 'string' ? document.querySelectorAll(selector)[0] : selector;
    var DPR = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2;

    typeof options === 'undefined' ? options = {} : options;

    var renderCallback = typeof options.success === 'function' ? options.success : function () {};
    options.success && (delete options.success);
    // var width = options.width || parent.offsetWidth;
    // var height = options.height || parent.offsetHeight;
    if (typeof Object.assign != 'function') {
      Object.assign = function(target) {
        'use strict';
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
    }

    function getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      var base64img = canvas.toDataURL("image/" + ext);
      return base64img;
    }

    function convert2base64(callback) {
      // var parent = document.querySelector(selector);
      var imageNode = parent.getElementsByTagName('img');
      var imageLen = imageNode.length;
      var crossUrl = [];

      var cnt = 0;
      function counter(successCallback) {
        cnt++;
        if (cnt === imageLen) {
          successCallback();
        }
      }

      for (var i = 0; i < imageLen; i++) {
        var imageElem = imageNode[i];
        var imageUrl = imageElem.getAttribute('data-src');
//        var isBase64 = /^data:image\/(jpeg|png|gif);base64$/g.test(imageUrl);
        var isQiniu = /\S*\/\/\S*.vipc.cn\//g.test(imageUrl);
        if (isQiniu) {
          crossUrl.push({elem: imageElem, url: imageUrl});
        } else {
          imageElem.src = imageUrl;
          try {
            imageElem.onload = function () {
              counter(callback);
            }
          } catch (e) {
            console.log('load image failed');
          }
        }
      }

      crossUrl.length > 0 && crossUrl.forEach(function (elem) {
        var image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = elem.url;
        try {
          image.onload = function () {
            elem.elem.src = getBase64Image(image);
            counter(callback);
          }
        } catch (e) {
          console.log('load image failed');
        }
      });
    }

    function html2image() {
      var canvas = document.createElement("canvas");
      var scale = DPR;
      var width = parent.offsetWidth;
      var height = parent.offsetHeight;
      var left = parent.offsetLeft;
      var context = canvas.getContext('2d');
      canvas.width = width * scale;
      canvas.height = height * scale;
      context.translate(-left * scale, 0);
      context.scale(scale, scale);

      var config = {
        onrendered: function (canvas) {
          var context = canvas.getContext('2d');

          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;

          var imgUrl = canvas.toDataURL("image/jpeg");
          var img = document.createElement('img');
          var div = document.createElement('div');
          img.src = imgUrl;
          div.className += 'screenshotWrap';
          img.style.maxWidth = canvas.width / scale + "px";
          img.style.maxheight = canvas.height / scale + "px";
          // img.style.maxWidth = width + 'px';
          // img.style.maxHeight = document.documentElement.clientHeight > height ? height + 'px' : document.documentElement.clientHeight + 'px';
          img.className += 'screenshotImg';
          img.onload = function () {
            renderCallback();
            div.appendChild(img);
            document.body.appendChild(div);
            div.style.opacity = 1;
          };


        },
        canvas: canvas,
        scale: scale,
        width: width,
        height: height,
        background: '#171143'
      };

      config = Object.assign(config, options);

      html2canvas(parent, config);
    }

    convert2base64(function () {
      parent.style.display = 'block';
      html2image();
    })
  };

  return VIPC.kitCore.screenshot = screenshot;
})();