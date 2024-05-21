"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BorderTabSet = void 0;
var React = _interopRequireWildcard(require("react"));
var _DockLocation = _interopRequireDefault(require("../DockLocation"));
var _BorderButton = require("./BorderButton");
var _PopupMenu = require("../PopupMenu");
var _Actions = _interopRequireDefault(require("../model/Actions"));
var _I18nLabel = require("../I18nLabel");
var _TabOverflowHook = require("./TabOverflowHook");
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _Types = require("../Types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
/** @hidden @internal */

/** @hidden @internal */
var BorderTabSet = exports.BorderTabSet = function BorderTabSet(props) {
  var border = props.border,
    layout = props.layout,
    iconFactory = props.iconFactory,
    titleFactory = props.titleFactory,
    icons = props.icons;
  var toolbarRef = React.useRef(null);
  var overflowbuttonRef = React.useRef(null);
  var stickyButtonsRef = React.useRef(null);
  var _useTabOverflow = (0, _TabOverflowHook.useTabOverflow)(border, _Orientation["default"].flip(border.getOrientation()), toolbarRef, stickyButtonsRef),
    selfRef = _useTabOverflow.selfRef,
    position = _useTabOverflow.position,
    userControlledLeft = _useTabOverflow.userControlledLeft,
    hiddenTabs = _useTabOverflow.hiddenTabs,
    onMouseWheel = _useTabOverflow.onMouseWheel;
  var onInterceptMouseDown = function onInterceptMouseDown(event) {
    event.stopPropagation();
  };
  var onOverflowClick = function onOverflowClick() {
    var element = overflowbuttonRef.current;
    (0, _PopupMenu.showPopup)(layout.getRootDiv(), element, hiddenTabs, onOverflowItemSelect, layout.getClassName);
  };
  var onOverflowItemSelect = function onOverflowItemSelect(item) {
    layout.doAction(_Actions["default"].selectTab(item.node.getId()));
    userControlledLeft.current = false;
  };
  var onFloatTab = function onFloatTab() {
    var selectedTabNode = border.getChildren()[border.getSelected()];
    if (selectedTabNode !== undefined) {
      layout.doAction(_Actions["default"].floatTab(selectedTabNode.getId()));
    }
  };
  var cm = layout.getClassName;
  var style = border.getTabHeaderRect().styleWithPosition({});
  var tabs = [];
  var layoutTab = function layoutTab(i) {
    var isSelected = border.getSelected() === i;
    var child = border.getChildren()[i];
    tabs.push( /*#__PURE__*/React.createElement(_BorderButton.BorderButton, {
      layout: layout,
      border: border.getLocation().getName(),
      node: child,
      key: child.getId(),
      selected: isSelected,
      iconFactory: iconFactory,
      titleFactory: titleFactory,
      icons: icons
    }));
  };
  for (var i = 0; i < border.getChildren().length; i++) {
    layoutTab(i);
  }
  var borderClasses = cm(_Types.CLASSES.FLEXLAYOUT__BORDER) + " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_ + border.getLocation().getName());
  if (border.getClassName() !== undefined) {
    borderClasses += " " + border.getClassName();
  }

  // allow customization of tabset right/bottom buttons
  var buttons = [];
  var renderState = {
    headerContent: {},
    buttons: buttons,
    stickyButtons: [],
    headerButtons: []
  };
  layout.customizeTabSet(border, renderState);
  buttons = renderState.buttons;
  var toolbar;
  if (hiddenTabs.length > 0) {
    var overflowTitle = layout.i18nName(_I18nLabel.I18nLabel.Overflow_Menu_Tooltip);
    buttons.push( /*#__PURE__*/React.createElement("button", {
      key: "overflowbutton",
      ref: overflowbuttonRef,
      className: cm("flexlayout__border_toolbar_button_overflow") + " " + cm("flexlayout__border_toolbar_button_overflow_" + border.getLocation().getName()),
      title: overflowTitle,
      onClick: onOverflowClick,
      onMouseDown: onInterceptMouseDown,
      onTouchStart: onInterceptMouseDown
    }, icons === null || icons === void 0 ? void 0 : icons.more, hiddenTabs.length));
  }
  var selectedIndex = border.getSelected();
  if (selectedIndex !== -1) {
    var selectedTabNode = border.getChildren()[selectedIndex];
    if (selectedTabNode !== undefined && layout.isSupportsPopout() && selectedTabNode.isEnableFloat() && !selectedTabNode.isFloating()) {
      var floatTitle = layout.i18nName(_I18nLabel.I18nLabel.Float_Tab);
      buttons.push( /*#__PURE__*/React.createElement("button", {
        key: "float",
        title: floatTitle,
        className: cm(_Types.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON) + " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_BUTTON_FLOAT),
        onClick: onFloatTab,
        onMouseDown: onInterceptMouseDown,
        onTouchStart: onInterceptMouseDown
      }));
    }
  }
  toolbar = /*#__PURE__*/React.createElement("div", {
    key: "toolbar",
    ref: toolbarRef,
    className: cm(_Types.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR) + " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_TOOLBAR_ + border.getLocation().getName())
  }, buttons);
  style = layout.styleFont(style);
  var innerStyle = {};
  var borderHeight = border.getBorderBarSize() - 1;
  if (border.getLocation() === _DockLocation["default"].LEFT) {
    innerStyle = {
      right: borderHeight,
      height: borderHeight,
      top: position
    };
  } else if (border.getLocation() === _DockLocation["default"].RIGHT) {
    innerStyle = {
      left: borderHeight,
      height: borderHeight,
      top: position
    };
  } else {
    innerStyle = {
      height: borderHeight,
      left: position
    };
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: selfRef,
    style: style,
    className: borderClasses,
    onWheel: onMouseWheel
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: borderHeight
    },
    className: cm(_Types.CLASSES.FLEXLAYOUT__BORDER_INNER) + " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_INNER_ + border.getLocation().getName())
  }, /*#__PURE__*/React.createElement("div", {
    style: innerStyle,
    className: cm(_Types.CLASSES.FLEXLAYOUT__BORDER_INNER_TAB_CONTAINER) + " " + cm(_Types.CLASSES.FLEXLAYOUT__BORDER_INNER_TAB_CONTAINER_ + border.getLocation().getName())
  }, tabs)), toolbar);
};
//# sourceMappingURL=BorderTabSet.js.map