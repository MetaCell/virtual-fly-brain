"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabButton = void 0;
var React = _interopRequireWildcard(require("react"));
var _I18nLabel = require("../I18nLabel");
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
var TabButton = exports.TabButton = function TabButton(props) {
  var layout = props.layout,
    node = props.node,
    show = props.show,
    selected = props.selected,
    iconFactory = props.iconFactory,
    titleFactory = props.titleFactory,
    icons = props.icons;
  var selfRef = React.useRef(null);
  var contentRef = React.useRef(null);
  var contentWidth = React.useRef(0);
  var onMouseDown = function onMouseDown(event) {
    if (!layout.getEditingTab()) {
      var message = layout.i18nName(_I18nLabel.I18nLabel.Move_Tab, node.getName());
      layout.dragStart(event, message, node, node.isEnableDrag(), onClick, onDoubleClick);
    }
  };
  var onClick = function onClick() {
    layout.doAction(_Actions["default"].selectTab(node.getId()));
  };
  var onDoubleClick = function onDoubleClick(event) {
    if (node.isEnableRename()) {
      layout.setEditingTab(node);
      layout.getCurrentDocument().body.addEventListener("mousedown", onEndEdit);
      layout.getCurrentDocument().body.addEventListener("touchstart", onEndEdit);
    }
    // else {
    //     const parentNode = node.getParent() as TabSetNode;
    //     if (parentNode.canMaximize()) {
    //         layout.maximize(parentNode);
    //     }
    // }
  };
  var onEndEdit = function onEndEdit(event) {
    if (event.target !== contentRef.current) {
      layout.getCurrentDocument().body.removeEventListener("mousedown", onEndEdit);
      layout.getCurrentDocument().body.removeEventListener("touchstart", onEndEdit);
      layout.setEditingTab(undefined);
    }
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
    if (layout.getEditingTab() === node) {
      contentRef.current.select();
    }
  });
  var updateRect = function updateRect() {
    // record position of tab in node
    var layoutRect = layout.getDomRect();
    var r = selfRef.current.getBoundingClientRect();
    node._setTabRect(new _Rect["default"](r.left - layoutRect.left, r.top - layoutRect.top, r.width, r.height));
    contentWidth.current = contentRef.current.getBoundingClientRect().width;
  };
  var onTextBoxMouseDown = function onTextBoxMouseDown(event) {
    // console.log("onTextBoxMouseDown");
    event.stopPropagation();
  };
  var onTextBoxKeyPress = function onTextBoxKeyPress(event) {
    // console.log(event, event.keyCode);
    if (event.keyCode === 27) {
      // esc
      layout.setEditingTab(undefined);
    } else if (event.keyCode === 13) {
      // enter
      layout.setEditingTab(undefined);
      layout.doAction(_Actions["default"].renameTab(node.getId(), event.target.value));
    }
  };
  var cm = layout.getClassName;
  var parentNode = node.getParent();
  var baseClassName = _Types.CLASSES.FLEXLAYOUT__TAB_BUTTON;
  var classNames = cm(baseClassName);
  classNames += " " + cm(baseClassName + "_" + parentNode.getTabLocation());
  if (selected) {
    classNames += " " + cm(baseClassName + "--selected");
  } else {
    classNames += " " + cm(baseClassName + "--unselected");
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
  buttons = renderState.buttons;
  node._setRenderedName(renderState.name);
  var content = /*#__PURE__*/React.createElement("div", {
    ref: contentRef,
    className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_BUTTON_CONTENT)
  }, renderState.content);
  var leading = /*#__PURE__*/React.createElement("div", {
    className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_BUTTON_LEADING)
  }, renderState.leading);
  if (layout.getEditingTab() === node) {
    var contentStyle = {
      width: contentWidth + "px"
    };
    content = /*#__PURE__*/React.createElement("input", {
      style: contentStyle,
      ref: contentRef,
      className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_BUTTON_TEXTBOX),
      type: "text",
      autoFocus: true,
      defaultValue: node.getName(),
      onKeyDown: onTextBoxKeyPress,
      onMouseDown: onTextBoxMouseDown,
      onTouchStart: onTextBoxMouseDown
    });
  }
  if (node.isEnableClose()) {
    var closeTitle = layout.i18nName(_I18nLabel.I18nLabel.Close_Tab);
    buttons.push( /*#__PURE__*/React.createElement("div", {
      key: "close",
      title: closeTitle,
      className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_BUTTON_TRAILING),
      onMouseDown: onCloseMouseDown,
      onClick: onClose,
      onTouchStart: onCloseMouseDown
    }, icons === null || icons === void 0 ? void 0 : icons.close));
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: selfRef,
    style: {
      visibility: show ? "visible" : "hidden"
    },
    className: classNames,
    onMouseDown: onMouseDown,
    onTouchStart: onMouseDown
  }, leading, content, buttons);
};
//# sourceMappingURL=TabButton.js.map