"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MinimizeHelper = void 0;
var React = _interopRequireWildcard(require("react"));
var _utils = require("../utils");
var _model = require("../model");
var _actions = require("../actions");
var _layout = require("../../layout");
var _FlexLayoutHelper = require("./FlexLayoutHelper");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var MinimizeHelper = /*#__PURE__*/function () {
  function MinimizeHelper(isMinimizeEnabled, model) {
    _classCallCheck(this, MinimizeHelper);
    _defineProperty(this, "isMinimizeEnabled", void 0);
    _defineProperty(this, "minimizeBorderID", void 0);
    _defineProperty(this, "store", void 0);
    _defineProperty(this, "model", void 0);
    var borders = model.getBorderSet().getBorders();
    var borderToMinimizeTo = (0, _utils.findBorderToMinimizeTo)(borders);
    this.isMinimizeEnabled = isMinimizeEnabled;
    this.model = model;
    this.minimizeBorderID = (borderToMinimizeTo === null || borderToMinimizeTo === void 0 ? void 0 : borderToMinimizeTo.getId()) || _layout.MINIMIZED_PANEL;
    this.store = null;
  }
  _createClass(MinimizeHelper, [{
    key: "getIsMinimizeEnabled",
    value: function getIsMinimizeEnabled() {
      return this.isMinimizeEnabled;
    }
  }, {
    key: "setStore",
    value: function setStore(store) {
      this.store = store;
    }
  }, {
    key: "isMinimized",
    value: function isMinimized(widget) {
      return widget.panelName == this.minimizeBorderID;
    }
  }, {
    key: "addMinimizeButtonToTabset",
    value: function addMinimizeButtonToTabset(panel, renderValues) {
      var _this = this;
      if (this.isMinimizeEnabled && this.minimizeBorderID) {
        if (panel.getChildren().length > 0) {
          renderValues.buttons.push( /*#__PURE__*/React.createElement("div", {
            key: panel.getId(),
            className: "fa fa-window-minimize customIconFlexLayout minimizeButton",
            onClick: function onClick() {
              _this.minimizeWidget(panel.getSelectedNode().getId());
            }
          }));
        }
      }
    }

    /**
     * Minimize a widget.
     *
     * @param widgetId
     * @private
     */
  }, {
    key: "minimizeWidget",
    value: function minimizeWidget(widgetId) {
      if (this.store && this.minimizeBorderID) {
        var updatedWidget = _objectSpread({}, (0, _utils.getWidget)(this.store, widgetId));
        updatedWidget.status = _model.WidgetStatus.MINIMIZED;
        updatedWidget.defaultPanel = updatedWidget.panelName;
        updatedWidget.panelName = this.minimizeBorderID;
        this.store.dispatch((0, _actions.updateWidget)(updatedWidget));
      } else {
        console.warn("Unable to minimize widget");
      }
    }
  }, {
    key: "restoreWidgetIfNecessary",
    value: function restoreWidgetIfNecessary(previousWidget, mergedWidget) {
      if (previousWidget.status != mergedWidget.status && previousWidget.status == _model.WidgetStatus.MINIMIZED) {
        this.restoreWidget(mergedWidget);
        return true;
      }
      return false;
    }

    /**
     * Restore widget.
     *
     * @param widget
     * @private
     */
  }, {
    key: "restoreWidget",
    value: function restoreWidget(widget) {
      var model = this.model;
      widget.panelName = widget.defaultPanel;
      var panelName = widget.panelName;
      var tabset = model.getNodeById(panelName);
      if (tabset === undefined) {
        (0, _FlexLayoutHelper.createTabSet)(model, panelName, widget.defaultPosition, widget.defaultWeight);
      }
      (0, _FlexLayoutHelper.moveWidget)(model, widget);
    }
  }]);
  return MinimizeHelper;
}();
exports.MinimizeHelper = MinimizeHelper;
//# sourceMappingURL=MinimizeHelper.js.map