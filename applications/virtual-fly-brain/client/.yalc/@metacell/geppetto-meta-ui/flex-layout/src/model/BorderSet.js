"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _BorderNode = _interopRequireDefault(require("./BorderNode"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var BorderSet = /*#__PURE__*/function () {
  /** @hidden @internal */
  function BorderSet(model) {
    _classCallCheck(this, BorderSet);
    /** @hidden @internal */
    _defineProperty(this, "_model", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_borders", void 0);
    this._model = model;
    this._borders = [];
  }
  return _createClass(BorderSet, [{
    key: "getBorders",
    value: function getBorders() {
      return this._borders;
    }

    /** @hidden @internal */
  }, {
    key: "_forEachNode",
    value: function _forEachNode(fn) {
      this._borders.forEach(function (borderNode) {
        fn(borderNode, 0);
        borderNode.getChildren().forEach(function (node) {
          node._forEachNode(fn, 1);
        });
      });
    }

    /** @hidden @internal */
  }, {
    key: "_toJson",
    value: function _toJson() {
      return this._borders.map(function (borderNode) {
        return borderNode._toJson();
      });
    }

    /** @hidden @internal */
  }, {
    key: "_layoutBorder",
    value: function _layoutBorder(outerInnerRects, metrics) {
      var rect = outerInnerRects.outer;
      var height = rect.height;
      var width = rect.width;
      var sumHeight = 0;
      var sumWidth = 0;
      var adjustableHeight = 0;
      var adjustableWidth = 0;
      var showingBorders = this._borders.filter(function (border) {
        return border.isShowing();
      });

      // sum size of borders to see they will fit
      var _iterator = _createForOfIteratorHelper(showingBorders),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _border = _step.value;
          if (_border.isShowing()) {
            _border._setAdjustedSize(_border.getSize());
            var visible = _border.getSelected() !== -1;
            if (_border.getLocation().getOrientation() === _Orientation["default"].HORZ) {
              sumWidth += _border.getBorderBarSize() + this._model.getSplitterSize();
              if (visible) {
                sumWidth += _border.getSize();
                adjustableWidth += _border.getSize();
              }
            } else {
              sumHeight += _border.getBorderBarSize() + this._model.getSplitterSize();
              if (visible) {
                sumHeight += _border.getSize();
                adjustableHeight += _border.getSize();
              }
            }
          }
        }

        // adjust border sizes if too large
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var j = 0;
      while (sumWidth > width && adjustableWidth > 0 || sumHeight > height && adjustableHeight > 0) {
        var border = showingBorders[j];
        if (border.getSelected() !== -1) {
          // visible
          var size = border._getAdjustedSize();
          if (sumWidth > width && adjustableWidth > 0 && border.getLocation().getOrientation() === _Orientation["default"].HORZ && size > 0) {
            border._setAdjustedSize(size - 1);
            sumWidth--;
            adjustableWidth--;
          } else if (sumHeight > height && adjustableHeight > 0 && border.getLocation().getOrientation() === _Orientation["default"].VERT && size > 0) {
            border._setAdjustedSize(size - 1);
            sumHeight--;
            adjustableHeight--;
          }
        }
        j = (j + 1) % showingBorders.length;
      }
      showingBorders.forEach(function (border) {
        outerInnerRects.outer = border._layoutBorderOuter(outerInnerRects.outer, metrics);
      });
      outerInnerRects.inner = outerInnerRects.outer;
      showingBorders.forEach(function (border) {
        outerInnerRects.inner = border._layoutBorderInner(outerInnerRects.inner, metrics);
      });
      return outerInnerRects;
    }

    /** @hidden @internal */
  }, {
    key: "_findDropTargetNode",
    value: function _findDropTargetNode(dragNode, x, y) {
      var _iterator2 = _createForOfIteratorHelper(this._borders),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var border = _step2.value;
          if (border.isShowing()) {
            var dropInfo = border.canDrop(dragNode, x, y);
            if (dropInfo !== undefined) {
              return dropInfo;
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return undefined;
    }
  }], [{
    key: "_fromJson",
    value: /** @hidden @internal */
    function _fromJson(json, model) {
      var borderSet = new BorderSet(model);
      borderSet._borders = json.map(function (borderJson) {
        return _BorderNode["default"]._fromJson(borderJson, model);
      });
      return borderSet;
    }
  }]);
}();
var _default = exports["default"] = BorderSet;
//# sourceMappingURL=BorderSet.js.map