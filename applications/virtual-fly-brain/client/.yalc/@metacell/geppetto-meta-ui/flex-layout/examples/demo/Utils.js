"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Utils = /*#__PURE__*/function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }
  return _createClass(Utils, null, [{
    key: "downloadFile",
    value: function downloadFile(downloadUrl, onSuccess, onError) {
      console.log("DownloadFile: " + downloadUrl);
      if (downloadUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', downloadUrl);
        xhr.onload = function () {
          if (xhr.status == 200) {
            onSuccess(xhr.responseText);
          } else {
            onError(xhr.status + " " + xhr.statusText);
          }
        };
        xhr.onerror = function (e) {
          console.log(e);
          onError(e);
        };
        xhr.send();
      }
    }
  }, {
    key: "getQueryParams",
    value: function getQueryParams() {
      var a = window.location.search.substr(1);
      if (a == "") return {};
      var params = a.split('&');
      var b = {};
      for (var i = 0; i < params.length; ++i) {
        var p = params[i].split('=', 2);
        if (p.length == 1) b[p[0]] = "";else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    }
  }]);
}();
var _default = exports["default"] = Utils;
//# sourceMappingURL=Utils.js.map