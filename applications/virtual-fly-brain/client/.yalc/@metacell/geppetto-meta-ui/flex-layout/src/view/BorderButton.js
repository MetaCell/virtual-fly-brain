"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BorderButton = void 0;
var React = _interopRequireWildcard(require("react"));
var _ = require("..");
var _Actions = _interopRequireDefault(require("../model/Actions"));
var _Rect = _interopRequireDefault(require("../Rect"));
var _ICloseType = require("../model/ICloseType");
var _Types = require("../Types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/** @hidden @internal */

/** @hidden @internal */
var BorderButton = exports.BorderButton = function BorderButton(props) {
  var layout = props.layout,
    node = props.node,
    selected = props.selected,
    border = props.border,
    iconFactory = props.iconFactory,
    titleFactory = props.titleFactory,
    icons = props.icons;
  var selfRef = React.useRef(null);
  var onMouseDown = function onMouseDown(event) {
    var message = layout.i18nName(_.I18nLabel.Move_Tab, node.getName());
    props.layout.dragStart(event, message, node, node.isEnableDrag(), onClick, function (event2) {
      return undefined;
    });
  };
  var onClick = function onClick() {
    // layout.doAction(Actions.selectTab(node.getId()));
    props.layout.customizeBottomBar(node);
  };
  var isClosable = function isClosable() {
    var closeType = node.getCloseType();
    if (selected || closeType === _ICloseType.ICloseType.Always) {
      return true;
    }
    if (closeType === _ICloseType.ICloseType.Visible) {
      // not selected but x should be visible due to hover
      if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return true;
      }
    }
    return false;
  };
  var onClose = function onClose(event) {
    if (isClosable()) {
      layout.doAction(_Actions["default"].deleteTab(node.getId()));
    } else {
      onClick();
    }
  };
  var onCloseMouseDown = function onCloseMouseDown(event) {
    event.stopPropagation();
  };
  React.useLayoutEffect(function () {
    updateRect();
  });
  var updateRect = function updateRect() {
    // record position of tab in border
    var clientRect = layout.getDomRect();
    var r = selfRef.current.getBoundingClientRect();
    node._setTabRect(new _Rect["default"](r.left - clientRect.left, r.top - clientRect.top, r.width, r.height));
  };
  var cm = layout.getClassName;
  var classNames = cm(_Types.CLASSES.FLEXLAYOUT__BORDER_BUTTON) + " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_BUTTON_ + border);
  if (selected) {
    classNames += " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_BUTTON__SELECTED);
  } else {
    classNames += " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_BUTTON__UNSELECTED);
  }
  if (node.getClassName() !== undefined) {
    classNames += " " + node.getClassName();
  }
  var leadingContent = iconFactory ? iconFactory(node) : undefined;
  var titleContent = node.getName();
  var name = node.getName();
  function isTitleObject(obj) {
    return obj.titleContent !== undefined;
  }
  if (titleFactory !== undefined) {
    var titleObj = titleFactory(node);
    if (titleObj !== undefined) {
      if (typeof titleObj === "string") {
        titleContent = titleObj;
        name = titleObj;
      } else if (isTitleObject(titleObj)) {
        titleContent = titleObj.titleContent;
        name = titleObj.name;
      } else {
        titleContent = titleObj;
      }
    }
  }
  if (_typeof(leadingContent) === undefined && _typeof(node.getIcon()) !== undefined) {
    leadingContent = /*#__PURE__*/React.createElement("img", {
      src: node.getIcon(),
      alt: "leadingContent"
    });
  }
  var buttons = [];

  // allow customization of leading contents (icon) and contents
  var renderState = {
    leading: leadingContent,
    content: titleContent,
    name: name,
    buttons: buttons
  };
  layout.customizeTab(node, renderState);
  node._setRenderedName(renderState.name);
  var content = /*#__PURE__*/React.createElement("div", {
    className: cm(_Types.CLASSES.FLEXLAYOUT__BORDER_BUTTON_CONTENT)
  }, renderState.content);
  var leading = /*#__PURE__*/React.createElement("div", {
    className: cm(_Types.CLASSES.FLEXLAYOUT__BORDER_BUTTON_LEADING)
  }, renderState.leading);
  if (node.isEnableClose()) {
    var closeTitle = layout.i18nName(_.I18nLabel.Close_Tab);
    buttons.push( /*#__PURE__*/React.createElement("div", {
      key: "close",
      title: closeTitle,
      className: cm(_Types.CLASSES.FLEXLAYOUT__BORDER_BUTTON_TRAILING),
      onMouseDown: onCloseMouseDown,
      onClick: onClose,
      onTouchStart: onCloseMouseDown
    }, icons === null || icons === void 0 ? void 0 : icons.close));
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: selfRef,
    style: {},
    className: classNames,
    onMouseDown: onMouseDown,
    onTouchStart: onMouseDown
  }, leading, content, buttons);
};
//# sourceMappingURL=BorderButton.js.map