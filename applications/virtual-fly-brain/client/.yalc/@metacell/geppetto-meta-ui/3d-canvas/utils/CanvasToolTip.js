"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var CanvasToolTip = /*#__PURE__*/_react["default"].forwardRef(function (props, ref) {
  var _intersected$o, _intersected$o2;
  var _React$useState = _react["default"].useState(null),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    intersected = _React$useState2[0],
    setIntersected = _React$useState2[1];
  var _React$useState3 = _react["default"].useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    tooltipVisible = _React$useState4[0],
    setTooltipVisible = _React$useState4[1];
  _react["default"].useImperativeHandle(ref, function () {
    return {
      updateIntersected: function updateIntersected(updatedIntersection) {
        if (updatedIntersection) {
          setIntersected(updatedIntersection);
          setTooltipVisible(true);
        } else {
          setTooltipVisible(false);
        }
      }
    };
  });
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, intersected && intersected.o && /*#__PURE__*/_react["default"].createElement("div", {
    id: "canvas-tooltip-".concat(intersected === null || intersected === void 0 || (_intersected$o = intersected.o) === null || _intersected$o === void 0 ? void 0 : _intersected$o.object.uuid),
    style: {
      position: 'fixed',
      left: intersected === null || intersected === void 0 ? void 0 : intersected.x,
      top: intersected === null || intersected === void 0 ? void 0 : intersected.y,
      zIndex: 9999,
      minWidth: '100px',
      textAlign: 'center',
      padding: '5px 12px',
      fontFamily: 'monospace',
      background: '#a0c020',
      display: tooltipVisible ? 'block' : 'none',
      opacity: '1',
      border: '1px solid black',
      boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.5)',
      transition: 'opacity 0.25s linear',
      borderRadius: '3px'
    }
  }, intersected === null || intersected === void 0 || (_intersected$o2 = intersected.o) === null || _intersected$o2 === void 0 ? void 0 : _intersected$o2.object.uuid));
});
var _default = exports["default"] = CanvasToolTip;
//# sourceMappingURL=CanvasToolTip.js.map