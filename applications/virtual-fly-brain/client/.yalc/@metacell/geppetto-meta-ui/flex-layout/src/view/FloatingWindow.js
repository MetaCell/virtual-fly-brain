"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FloatingWindow = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactDom = require("react-dom");
var _Types = require("../Types");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/** @hidden @internal */

/** @hidden @internal */
var FloatingWindow = exports.FloatingWindow = function FloatingWindow(props) {
  var title = props.title,
    id = props.id,
    url = props.url,
    rect = props.rect,
    onCloseWindow = props.onCloseWindow,
    onSetWindow = props.onSetWindow,
    children = props.children;
  var popoutWindow = React.useRef(null);
  var _React$useState = React.useState(undefined),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    content = _React$useState2[0],
    setContent = _React$useState2[1];
  React.useLayoutEffect(function () {
    var r = rect;
    popoutWindow.current = window.open(url, id, "left=".concat(r.x, ",top=").concat(r.y, ",width=").concat(r.width, ",height=").concat(r.height));
    if (popoutWindow.current !== null) {
      onSetWindow(id, popoutWindow.current);

      // listen for parent unloading to remove all popouts
      window.addEventListener("beforeunload", function () {
        if (popoutWindow.current) {
          popoutWindow.current.close();
          popoutWindow.current = null;
        }
      });
      popoutWindow.current.addEventListener("load", function () {
        var popoutDocument = popoutWindow.current.document;
        popoutDocument.title = title;
        var popoutContent = popoutDocument.createElement("div");
        popoutContent.className = _Types.CLASSES.FLEXLAYOUT__FLOATING_WINDOW_CONTENT;
        popoutDocument.body.appendChild(popoutContent);
        copyStyles(popoutDocument).then(function () {
          setContent(popoutContent);
        });

        // listen for popout unloading (needs to be after load for safari)
        popoutWindow.current.addEventListener("beforeunload", function () {
          onCloseWindow(id);
        });
      });
    } else {
      console.warn("Unable to open window ".concat(url));
      onCloseWindow(id);
    }
    return function () {
      // delay so refresh will close window
      setTimeout(function () {
        if (popoutWindow.current) {
          popoutWindow.current.close();
          popoutWindow.current = null;
        }
      }, 0);
    };
  }, []);
  if (content !== undefined) {
    return /*#__PURE__*/(0, _reactDom.createPortal)(children, content);
  } else {
    return null;
  }
};

/** @hidden @internal */
function copyStyles(doc) {
  var head = doc.head;
  var promises = [];
  Array.from(window.document.styleSheets).forEach(function (styleSheet) {
    if (styleSheet.href) {
      // prefer links since they will keep paths to images etc
      var styleElement = doc.createElement("link");
      styleElement.type = styleSheet.type;
      styleElement.rel = "stylesheet";
      styleElement.href = styleSheet.href;
      head.appendChild(styleElement);
      promises.push(new Promise(function (resolve, reject) {
        styleElement.onload = function () {
          return resolve(true);
        };
      }));
    } else {
      try {
        var rules = styleSheet.cssRules;
        var style = doc.createElement("style");
        Array.from(rules).forEach(function (cssRule) {
          style.appendChild(doc.createTextNode(cssRule.cssText));
        });
        head.appendChild(style);
      } catch (e) {
        // styleSheet.cssRules can thro security exception
      }
    }
  });
  return Promise.all(promises);
}
//# sourceMappingURL=FloatingWindow.js.map