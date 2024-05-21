"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabSet = void 0;
var React = _interopRequireWildcard(require("react"));
var _I18nLabel = require("../I18nLabel");
var _Actions = _interopRequireDefault(require("../model/Actions"));
var _PopupMenu = require("../PopupMenu");
var _TabButton = require("./TabButton");
var _TabOverflowHook = require("./TabOverflowHook");
var _Orientation = _interopRequireDefault(require("../Orientation"));
var _Types = require("../Types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/** @hidden @internal */

/** @hidden @internal */
var TabSet = exports.TabSet = function TabSet(props) {
  var node = props.node,
    layout = props.layout,
    iconFactory = props.iconFactory,
    titleFactory = props.titleFactory,
    icons = props.icons;
  var toolbarRef = React.useRef(null);
  var overflowbuttonRef = React.useRef(null);
  var tabbarInnerRef = React.useRef(null);
  var stickyButtonsRef = React.useRef(null);
  var _useTabOverflow = (0, _TabOverflowHook.useTabOverflow)(node, _Orientation["default"].HORZ, toolbarRef, stickyButtonsRef),
    selfRef = _useTabOverflow.selfRef,
    position = _useTabOverflow.position,
    userControlledLeft = _useTabOverflow.userControlledLeft,
    hiddenTabs = _useTabOverflow.hiddenTabs,
    onMouseWheel = _useTabOverflow.onMouseWheel,
    tabsTruncated = _useTabOverflow.tabsTruncated;
  var onOverflowClick = function onOverflowClick() {
    var element = overflowbuttonRef.current;
    (0, _PopupMenu.showPopup)(layout.getRootDiv(), element, hiddenTabs, onOverflowItemSelect, layout.getClassName);
  };
  var onOverflowItemSelect = function onOverflowItemSelect(item) {
    layout.doAction(_Actions["default"].selectTab(item.node.getId()));
    userControlledLeft.current = false;
  };
  var onMouseDown = function onMouseDown(event) {
    var name = node.getName();
    if (name === undefined) {
      name = "";
    } else {
      name = ": " + name;
    }
    layout.doAction(_Actions["default"].setActiveTabset(node.getId()));
    if (!layout.getEditingTab()) {
      var message = layout.i18nName(_I18nLabel.I18nLabel.Move_Tabset, name);
      layout.dragStart(event, message, node, node.isEnableDrag(), function (event2) {
        return undefined;
      }, onDoubleClick);
    }
  };
  var onInterceptMouseDown = function onInterceptMouseDown(event) {
    event.stopPropagation();
  };
  var onMaximizeToggle = function onMaximizeToggle() {
    if (node.canMaximize()) {
      layout.maximize(node);
    }
  };
  var onFloatTab = function onFloatTab() {
    if (selectedTabNode !== undefined) {
      layout.doAction(_Actions["default"].floatTab(selectedTabNode.getId()));
    }
  };
  var onDoubleClick = function onDoubleClick(event) {
    if (node.canMaximize()) {
      layout.maximize(node);
    }
  };

  // Start Render
  var cm = layout.getClassName;

  // tabbar inner can get shifted left via tab rename, this resets scrollleft to 0
  if (tabbarInnerRef.current !== null && tabbarInnerRef.current.scrollLeft !== 0) {
    tabbarInnerRef.current.scrollLeft = 0;
  }
  var selectedTabNode = node.getSelectedNode();
  var style = node._styleWithPosition();
  if (node.getModel().getMaximizedTabset() !== undefined && !node.isMaximized()) {
    style.display = "none";
  }
  var tabs = [];
  if (node.isEnableTabStrip()) {
    for (var i = 0; i < node.getChildren().length; i++) {
      var child = node.getChildren()[i];
      var isSelected = node.getSelected() === i;
      tabs.push( /*#__PURE__*/React.createElement(_TabButton.TabButton, {
        layout: layout,
        node: child,
        key: child.getId(),
        selected: isSelected,
        show: true,
        height: node.getTabStripHeight(),
        iconFactory: iconFactory,
        titleFactory: titleFactory,
        icons: icons
      }));
    }
  }
  var showHeader = node.getName() !== undefined;
  var stickyButtons = [];
  var buttons = [];
  var headerButtons = [];

  // allow customization of header contents and buttons
  var renderState = {
    headerContent: node.getName(),
    stickyButtons: stickyButtons,
    buttons: buttons,
    headerButtons: headerButtons
  };
  layout.customizeTabSet(node, renderState);
  var headerContent = renderState.headerContent;
  stickyButtons = renderState.stickyButtons;
  buttons = renderState.buttons;
  headerButtons = renderState.headerButtons;
  if (stickyButtons.length > 0) {
    if (tabsTruncated) {
      buttons = [].concat(_toConsumableArray(stickyButtons), _toConsumableArray(buttons));
    } else {
      tabs.push( /*#__PURE__*/React.createElement("div", {
        ref: stickyButtonsRef,
        key: "sticky_buttons_container",
        onMouseDown: onInterceptMouseDown,
        onTouchStart: onInterceptMouseDown,
        onDragStart: function onDragStart(e) {
          e.preventDefault();
        },
        className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_STICKY_BUTTONS_CONTAINER)
      }, stickyButtons));
    }
  }
  var toolbar;
  if (hiddenTabs.length > 0) {
    var overflowTitle = layout.i18nName(_I18nLabel.I18nLabel.Overflow_Menu_Tooltip);
    buttons.push( /*#__PURE__*/React.createElement("button", {
      key: "overflowbutton",
      ref: overflowbuttonRef,
      className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_BUTTON_OVERFLOW),
      title: overflowTitle,
      onClick: onOverflowClick,
      onMouseDown: onInterceptMouseDown,
      onTouchStart: onInterceptMouseDown
    }, icons === null || icons === void 0 ? void 0 : icons.more, hiddenTabs.length));
  }
  if (selectedTabNode !== undefined && layout.isSupportsPopout() && selectedTabNode.isEnableFloat() && !selectedTabNode.isFloating()) {
    var floatTitle = layout.i18nName(_I18nLabel.I18nLabel.Float_Tab);
    buttons.push( /*#__PURE__*/React.createElement("button", {
      key: "float",
      title: floatTitle,
      className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON) + " " + cm(_Types.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON_FLOAT),
      onClick: onFloatTab,
      onMouseDown: onInterceptMouseDown,
      onTouchStart: onInterceptMouseDown
    }, icons === null || icons === void 0 ? void 0 : icons.popout));
  }
  if (node.canMaximize()) {
    var minTitle = layout.i18nName(_I18nLabel.I18nLabel.Restore);
    var maxTitle = layout.i18nName(_I18nLabel.I18nLabel.Maximize);
    var btns = showHeader ? headerButtons : buttons;
    btns.push( /*#__PURE__*/React.createElement("button", {
      key: "max",
      title: node.isMaximized() ? minTitle : maxTitle,
      className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON) + " " + cm(_Types.CLASSES.FLEXLAYOUT__TAB_TOOLBAR_BUTTON_ + (node.isMaximized() ? "max" : "min")),
      onClick: onMaximizeToggle,
      onMouseDown: onInterceptMouseDown,
      onTouchStart: onInterceptMouseDown
    }, node.isMaximized() ? icons === null || icons === void 0 ? void 0 : icons.restore : icons === null || icons === void 0 ? void 0 : icons.maximize));
  }
  toolbar = /*#__PURE__*/React.createElement("div", {
    key: "toolbar",
    ref: toolbarRef,
    className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_TOOLBAR),
    onMouseDown: onInterceptMouseDown,
    onTouchStart: onInterceptMouseDown,
    onDragStart: function onDragStart(e) {
      e.preventDefault();
    }
  }, buttons);
  var header;
  var tabStrip;
  var tabStripClasses = cm(_Types.CLASSES.FLEXLAYOUT__TABSET_TABBAR_OUTER);
  if (node.getClassNameTabStrip() !== undefined) {
    tabStripClasses += " " + node.getClassNameTabStrip();
  }
  tabStripClasses += " " + _Types.CLASSES.FLEXLAYOUT__TABSET_TABBAR_OUTER_ + node.getTabLocation();
  if (node.isActive() && !showHeader) {
    tabStripClasses += " " + cm(_Types.CLASSES.FLEXLAYOUT__TABSET_SELECTED);
  }
  if (node.isMaximized() && !showHeader) {
    tabStripClasses += " " + cm(_Types.CLASSES.FLEXLAYOUT__TABSET_MAXIMIZED);
  }
  if (showHeader) {
    var headerToolbar = /*#__PURE__*/React.createElement("div", {
      key: "toolbar",
      ref: toolbarRef,
      className: cm(_Types.CLASSES.FLEXLAYOUT__TAB_TOOLBAR),
      onMouseDown: onInterceptMouseDown,
      onTouchStart: onInterceptMouseDown,
      onDragStart: function onDragStart(e) {
        e.preventDefault();
      }
    }, headerButtons);
    var tabHeaderClasses = cm(_Types.CLASSES.FLEXLAYOUT__TABSET_HEADER);
    if (node.isActive()) {
      tabHeaderClasses += " " + cm(_Types.CLASSES.FLEXLAYOUT__TABSET_SELECTED);
    }
    if (node.isMaximized()) {
      tabHeaderClasses += " " + cm(_Types.CLASSES.FLEXLAYOUT__TABSET_MAXIMIZED);
    }
    if (node.getClassNameHeader() !== undefined) {
      tabHeaderClasses += " " + node.getClassNameHeader();
    }
    header = /*#__PURE__*/React.createElement("div", {
      className: tabHeaderClasses,
      style: {
        height: node.getHeaderHeight() + "px"
      },
      onMouseDown: onMouseDown,
      onTouchStart: onMouseDown
    }, /*#__PURE__*/React.createElement("div", {
      className: cm(_Types.CLASSES.FLEXLAYOUT__TABSET_HEADER_CONTENT)
    }, headerContent), headerToolbar);
  }
  var tabStripStyle = {
    height: node.getTabStripHeight() + "px"
  };
  if (node.getTabLocation() === "top") {
    var top = showHeader ? node.getHeaderHeight() + "px" : "0px";
    tabStripStyle["top"] = top;
  } else {
    tabStripStyle["bottom"] = "0px";
  }
  tabStrip = /*#__PURE__*/React.createElement("div", {
    className: tabStripClasses,
    style: tabStripStyle,
    onMouseDown: onMouseDown,
    onTouchStart: onMouseDown
  }, /*#__PURE__*/React.createElement("div", {
    ref: tabbarInnerRef,
    className: cm(_Types.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER) + " " + cm(_Types.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER_ + node.getTabLocation())
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      left: position
    },
    className: cm(_Types.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER_TAB_CONTAINER) + " " + cm(_Types.CLASSES.FLEXLAYOUT__TABSET_TABBAR_INNER_TAB_CONTAINER_ + node.getTabLocation())
  }, tabs)), toolbar);
  style = layout.styleFont(style);
  return /*#__PURE__*/React.createElement("div", {
    ref: selfRef,
    style: style,
    className: cm(_Types.CLASSES.FLEXLAYOUT__TABSET),
    onWheel: onMouseWheel
  }, header, tabStrip);
};
//# sourceMappingURL=TabSet.js.map