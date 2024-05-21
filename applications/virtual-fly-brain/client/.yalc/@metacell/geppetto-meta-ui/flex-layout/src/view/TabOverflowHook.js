"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTabOverflow = void 0;
var React = _interopRequireWildcard(require("react"));
var _Rect = _interopRequireDefault(require("../Rect"));
var _TabSetNode = _interopRequireDefault(require("../model/TabSetNode"));
var _Orientation = _interopRequireDefault(require("../Orientation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/** @hidden @internal */
var useTabOverflow = exports.useTabOverflow = function useTabOverflow(node, orientation, toolbarRef, stickyButtonsRef) {
  var firstRender = React.useRef(true);
  var tabsTruncated = React.useRef(false);
  var lastRect = React.useRef(new _Rect["default"](0, 0, 0, 0));
  var selfRef = React.useRef(null);
  var _React$useState = React.useState(0),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    position = _React$useState2[0],
    setPosition = _React$useState2[1];
  var userControlledLeft = React.useRef(false);
  var _React$useState3 = React.useState([]),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    hiddenTabs = _React$useState4[0],
    setHiddenTabs = _React$useState4[1];

  // if selected node or tabset/border rectangle change then unset usercontrolled (so selected tab will be kept in view)
  React.useLayoutEffect(function () {
    userControlledLeft.current = false;
  }, [node.getSelectedNode(), node.getRect().width, node.getRect().height]);
  React.useLayoutEffect(function () {
    updateVisibleTabs();
  });
  React.useEffect(function () {
    var instance = selfRef.current;
    instance.addEventListener('wheel', onWheel);
    return function () {
      instance.removeEventListener('wheel', onWheel);
    };
  }, []);

  // needed to prevent default mouse wheel over tabset/border (cannot do with react event?)
  var onWheel = function onWheel(event) {
    event.preventDefault();
  };
  var getNear = function getNear(rect) {
    if (orientation === _Orientation["default"].HORZ) {
      return rect.x;
    } else {
      return rect.y;
    }
  };
  var getFar = function getFar(rect) {
    if (orientation === _Orientation["default"].HORZ) {
      return rect.getRight();
    } else {
      return rect.getBottom();
    }
  };
  var getSize = function getSize(rect) {
    if (orientation === _Orientation["default"].HORZ) {
      return rect.width;
    } else {
      return rect.height;
    }
  };
  var updateVisibleTabs = function updateVisibleTabs() {
    var tabMargin = 2;
    if (firstRender.current === true) {
      tabsTruncated.current = false;
    }
    var nodeRect = node instanceof _TabSetNode["default"] ? node.getRect() : node.getTabHeaderRect();
    var lastChild = node.getChildren()[node.getChildren().length - 1];
    var stickyButtonsSize = stickyButtonsRef.current === null ? 0 : getSize(stickyButtonsRef.current.getBoundingClientRect());
    if (firstRender.current === true || nodeRect.width !== lastRect.current.width ||
    // incase rect changed between first render and second
    nodeRect.height !== lastRect.current.height) {
      lastRect.current = nodeRect;
      var enabled = node instanceof _TabSetNode["default"] ? node.isEnableTabStrip() === true : true;
      var endPos = getFar(nodeRect) - stickyButtonsSize;
      if (toolbarRef.current !== null) {
        endPos -= getSize(toolbarRef.current.getBoundingClientRect());
      }
      if (enabled && node.getChildren().length > 0) {
        if (hiddenTabs.length === 0 && position === 0 && getFar(lastChild.getTabRect()) + tabMargin < endPos) {
          return; // nothing to do all tabs are shown in available space
        }
        endPos -= hiddenTabs.length > 0 ? orientation === _Orientation["default"].HORZ ? 10 : 0 : 45; // will need hidden tabs

        var shiftPos = 0;
        var selectedTab = node.getSelectedNode();
        if (selectedTab && !userControlledLeft.current) {
          var selectedRect = selectedTab.getTabRect();
          var selectedStart = getNear(selectedRect) - tabMargin;
          var selectedEnd = getFar(selectedRect) + tabMargin;

          // when selected tab is larger than available space then align left
          if (getSize(selectedRect) + 2 * tabMargin >= endPos - getNear(nodeRect)) {
            shiftPos = getNear(nodeRect) - selectedStart;
          } else {
            if (selectedEnd > endPos || selectedStart < getNear(nodeRect)) {
              if (selectedStart < getNear(nodeRect)) {
                shiftPos = getNear(nodeRect) - selectedStart;
              }
              // use second if statement to prevent tab moving back then forwards if not enough space for single tab
              if (selectedEnd + shiftPos > endPos) {
                shiftPos = endPos - selectedEnd;
              }
            }
          }
        }
        var extraSpace = Math.max(0, endPos - (getFar(lastChild.getTabRect()) + tabMargin + shiftPos));
        var newPosition = Math.min(0, position + shiftPos + extraSpace);

        // find hidden tabs
        var diff = newPosition - position;
        var hidden = [];
        for (var i = 0; i < node.getChildren().length; i++) {
          var child = node.getChildren()[i];
          if (getNear(child.getTabRect()) + diff < getNear(nodeRect) || getFar(child.getTabRect()) + diff > endPos) {
            hidden.push({
              node: child,
              index: i
            });
          }
        }
        if (hidden.length > 0) {
          tabsTruncated.current = true;
        }
        firstRender.current = false; // need to do a second render
        setHiddenTabs(hidden);
        setPosition(newPosition);
      }
    } else {
      firstRender.current = true;
    }
  };
  var onMouseWheel = function onMouseWheel(event) {
    var delta = 0;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      delta = -event.deltaX;
    } else {
      delta = -event.deltaY;
    }
    if (event.deltaMode === 1) {
      // DOM_DELTA_LINE	0x01	The delta values are specified in lines.
      delta *= 40;
    }
    setPosition(position + delta);
    userControlledLeft.current = true;
    event.stopPropagation();
  };
  return {
    selfRef: selfRef,
    position: position,
    userControlledLeft: userControlledLeft,
    hiddenTabs: hiddenTabs,
    onMouseWheel: onMouseWheel,
    tabsTruncated: tabsTruncated.current
  };
};
//# sourceMappingURL=TabOverflowHook.js.map