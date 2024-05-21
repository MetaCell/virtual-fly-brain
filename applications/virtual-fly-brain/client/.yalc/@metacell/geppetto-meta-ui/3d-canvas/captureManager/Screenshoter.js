"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadScreenshot = downloadScreenshot;
var htmlToImage = _interopRequireWildcard(require("html-to-image"));
var _utils = require("./utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function getOptions(htmlElement, targetResolution, quality, pixelRatio, filter) {
  var resolution = getResolutionFixedRatio(htmlElement, targetResolution);
  var options = {
    quality: quality,
    canvasWidth: resolution.width,
    canvasHeight: resolution.height,
    pixelRatio: pixelRatio,
    filter: filter
  };
  return options;
}
function downloadScreenshot(htmlElement) {
  var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.95;
  var targetResolution = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    width: 3840,
    height: 2160
  };
  var pixelRatio = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var filter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {
    return true;
  };
  var filename = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "Canvas_".concat((0, _utils.formatDate)(new Date()), ".png");
  var options = getOptions(htmlElement, targetResolution, quality, pixelRatio, filter);
  htmlToImage.toPng(htmlElement, options).then(function (dataUrl) {
    var link = window.document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  });
}
function getResolutionFixedRatio(htmlElement, target) {
  var current = {
    height: htmlElement.clientHeight,
    width: htmlElement.clientWidth
  };
  // if height is closer
  if (Math.abs(target.width - current.width) * 9 / 16 > Math.abs(target.height - current.height)) {
    return {
      height: target.height,
      width: Math.round(current.width * target.height / current.height)
    };
  }
  return {
    height: Math.round(current.height * target.width / current.width),
    width: target.width
  };
}
//# sourceMappingURL=Screenshoter.js.map