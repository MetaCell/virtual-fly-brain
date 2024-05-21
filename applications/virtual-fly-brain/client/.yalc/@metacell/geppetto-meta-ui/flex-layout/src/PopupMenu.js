"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showPopup = showPopup;
var React = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/** @hidden @internal */
function showPopup(layoutDiv, triggerElement, items, onSelect, classNameMapper) {
  var currentDocument = triggerElement.ownerDocument;
  var triggerRect = triggerElement.getBoundingClientRect();
  var layoutRect = layoutDiv.getBoundingClientRect();
  var elm = currentDocument.createElement("div");
  elm.className = classNameMapper("flexlayout__popup_menu_container");
  if (triggerRect.left < layoutRect.left + layoutRect.width / 2) {
    elm.style.left = triggerRect.left - layoutRect.left + "px";
  } else {
    elm.style.right = layoutRect.right - triggerRect.right + "px";
  }
  if (triggerRect.top < layoutRect.top + layoutRect.height / 2) {
    elm.style.top = triggerRect.top - layoutRect.top + "px";
  } else {
    elm.style.bottom = layoutRect.bottom - triggerRect.bottom + "px";
  }
  layoutDiv.appendChild(elm);
  var onHide = function onHide() {
    layoutDiv.removeChild(elm);
    ReactDOM.unmountComponentAtNode(elm);
    elm.removeEventListener("mouseup", onElementMouseUp);
    currentDocument.removeEventListener("mouseup", onDocMouseUp);
  };
  var onElementMouseUp = function onElementMouseUp(event) {
    event.stopPropagation();
  };
  var onDocMouseUp = function onDocMouseUp(event) {
    onHide();
  };
  elm.addEventListener("mouseup", onElementMouseUp);
  currentDocument.addEventListener("mouseup", onDocMouseUp);
  ReactDOM.render( /*#__PURE__*/React.createElement(PopupMenu, {
    currentDocument: currentDocument,
    onSelect: onSelect,
    onHide: onHide,
    items: items,
    classNameMapper: classNameMapper
  }), elm);
}

/** @hidden @internal */

/** @hidden @internal */
var PopupMenu = function PopupMenu(props) {
  var items = props.items,
    onHide = props.onHide,
    onSelect = props.onSelect,
    classNameMapper = props.classNameMapper;
  var onItemClick = function onItemClick(item, event) {
    onSelect(item);
    onHide();
    event.stopPropagation();
  };
  var itemElements = items.map(function (item) {
    return /*#__PURE__*/React.createElement("div", {
      key: item.index,
      className: classNameMapper("flexlayout__popup_menu_item"),
      onClick: function onClick(event) {
        return onItemClick(item, event);
      }
    }, item.node._getRenderedName());
  });
  return /*#__PURE__*/React.createElement("div", {
    className: classNameMapper("flexlayout__popup_menu")
  }, itemElements);
};
//# sourceMappingURL=PopupMenu.js.map