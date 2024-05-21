"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Splitter = void 0;
var React = _interopRequireWildcard(require("react"));
var _DragDrop = _interopRequireDefault(require("../DragDrop"));
var _Actions = _interopRequireDefault(require("../model/Actions"));
var _BorderNode = _interopRequireDefault(require("../model/BorderNode"));
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _Types = require("../Types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/** @hidden @internal */

/** @hidden @internal */
var Splitter = exports.Splitter = function Splitter(props) {
  var layout = props.layout,
    node = props.node;
  var pBounds = React.useRef([]);
  var outlineDiv = React.useRef(undefined);
  var parentNode = node.getParent();
  var onMouseDown = function onMouseDown(event) {
    _DragDrop["default"].instance.startDrag(event, onDragStart, onDragMove, onDragEnd, onDragCancel, undefined, undefined, layout.getCurrentDocument(), layout.getRootDiv());
    pBounds.current = parentNode._getSplitterBounds(node, true);
    var rootdiv = layout.getRootDiv();
    outlineDiv.current = layout.getCurrentDocument().createElement("div");
    outlineDiv.current.style.position = "absolute";
    outlineDiv.current.className = layout.getClassName(_Types.CLASSES.FLEXLAYOUT__SPLITTER_DRAG);
    outlineDiv.current.style.cursor = node.getOrientation() === _Orientation["default"].HORZ ? "ns-resize" : "ew-resize";
    node.getRect().positionElement(outlineDiv.current);
    rootdiv.appendChild(outlineDiv.current);
  };
  var onDragCancel = function onDragCancel(wasDragging) {
    var rootdiv = layout.getRootDiv();
    rootdiv.removeChild(outlineDiv.current);
  };
  var onDragStart = function onDragStart() {
    return true;
  };
  var onDragMove = function onDragMove(event) {
    var clientRect = layout.getDomRect();
    var pos = {
      x: event.clientX - clientRect.left,
      y: event.clientY - clientRect.top
    };
    if (outlineDiv) {
      if (node.getOrientation() === _Orientation["default"].HORZ) {
        outlineDiv.current.style.top = getBoundPosition(pos.y - 4) + "px";
      } else {
        outlineDiv.current.style.left = getBoundPosition(pos.x - 4) + "px";
      }
    }
  };
  var onDragEnd = function onDragEnd() {
    var value = 0;
    if (outlineDiv) {
      if (node.getOrientation() === _Orientation["default"].HORZ) {
        value = outlineDiv.current.offsetTop;
      } else {
        value = outlineDiv.current.offsetLeft;
      }
    }
    if (parentNode instanceof _BorderNode["default"]) {
      var pos = parentNode._calculateSplit(node, value);
      layout.doAction(_Actions["default"].adjustBorderSplit(node.getParent().getId(), pos));
    } else {
      var splitSpec = parentNode._calculateSplit(node, value);
      if (splitSpec !== undefined) {
        layout.doAction(_Actions["default"].adjustSplit(splitSpec));
      }
    }
    var rootdiv = layout.getRootDiv();
    rootdiv.removeChild(outlineDiv.current);
  };
  var getBoundPosition = function getBoundPosition(p) {
    var bounds = pBounds.current;
    var rtn = p;
    if (p < bounds[0]) {
      rtn = bounds[0];
    }
    if (p > bounds[1]) {
      rtn = bounds[1];
    }
    return rtn;
  };
  var cm = layout.getClassName;
  var style = node._styleWithPosition({
    cursor: node.getOrientation() === _Orientation["default"].HORZ ? "ns-resize" : "ew-resize"
  });
  var className = cm(_Types.CLASSES.FLEXLAYOUT__SPLITTER) + " " + cm(_Types.CLASSES.FLEXLAYOUT__SPLITTER_ + node.getOrientation().getName());
  if (parentNode instanceof _BorderNode["default"]) {
    className += " " + cm(_Types.CLASSES.FLEXLAYOUT__SPLITTER_BORDER);
  } else {
    if (node.getModel().getMaximizedTabset() !== undefined) {
      style.display = "none";
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: style,
    onTouchStart: onMouseDown,
    onMouseDown: onMouseDown,
    className: className
  });
};
//# sourceMappingURL=Splitter.js.map