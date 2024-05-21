"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var React = _interopRequireWildcard(require("react"));
var _actions = require("./actions");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * Widget Factory. All components shown in the main flexible layout are instantiated here.
 *
 * @memberof Control
 */
var WidgetFactory = /*#__PURE__*/function () {
  /**
   * Dict of widgets.
   */

  // didn't found a way to make standard refs work here, so using a custom callback

  function WidgetFactory(componentMap) {
    var _this = this;
    _classCallCheck(this, WidgetFactory);
    _defineProperty(this, "widgets", {});
    _defineProperty(this, "componentMap", {});
    _defineProperty(this, "store", void 0);
    _defineProperty(this, "refs", {});
    _defineProperty(this, "WidgetToComponent", function (_ref) {
      var widgetConfig = _ref.widgetConfig;
      _this.refs[widgetConfig.id] = /*#__PURE__*/React.createRef();
      var Component = _this.componentMap[widgetConfig.component];
      var proto = Component.WrappedComponent ? Component.WrappedComponent.proto : Component.proto;
      var ref = proto && proto.importSession ? {
        ref: _this.refs[widgetConfig.id]
      } : {};

      // Note: the sessionChange is an option that is available to save components sessions within the widget itself
      // It's a more reacty way than using references and also works for functional components, but it's not 
      // possible to push a session update top-down, so it's the component that would need to know when its internal 
      // session data changed. Note that the session save/load is not a preferable way to implement application state
      // logic persistence, it's rather a workaround to catch what may escape form React/Redux control (e.g. canvas data)
      var sessionChange = function sessionChange(session) {
        _this.store.dispatch((0, _actions.updateWidget)(_objectSpread(_objectSpread({}, widgetConfig), {}, {
          session: session
        })));
      };
      return Component ? /*#__PURE__*/React.createElement(Component, _extends({
        id: widgetConfig.id,
        key: widgetConfig.id,
        session: widgetConfig.session,
        onSessionChange: sessionChange
      }, widgetConfig.config, widgetConfig.props, ref)) : /*#__PURE__*/React.createElement("div", null, "Error on widget configuration ", widgetConfig.id, ": no component matching \"", widgetConfig.component, "\"");
    });
    this.widgets = {};
    this.componentMap = componentMap;
  }
  _createClass(WidgetFactory, [{
    key: "setStore",
    value: function setStore(store) {
      this.store = store;
    }
  }, {
    key: "addComponentMapping",
    value: function addComponentMapping(key, component) {
      this.componentMap[key] = component;
    }
  }, {
    key: "updateComponentMapping",
    value: function updateComponentMapping(componentMap) {
      this.componentMap = _objectSpread(_objectSpread({}, this.componentMap), componentMap);
    }
  }, {
    key: "factory",
    value:
    /**
     * Widget configuration is the same we are using in the flexlayout actions
     *
     * { id, name, component, panelName, [instancePath], * } widgetConfig
     */
    function factory(widgetConfig) {
      if (!this.widgets[widgetConfig.id]) {
        this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
      }
      return this.widgets[widgetConfig.id];
    }

    /**
     * Retrieves all components
     */
  }, {
    key: "getComponents",
    value: function getComponents() {
      var confs = {};
      for (var wid in this.refs) {
        var component = this.refs[wid].current;
        if (component && component.exportSession) {
          confs[wid] = component;
        }
      }
      return confs;
    }

    /**
     * Returns widget matching `widgetId`.
     *
     * @param {string} widgetId specific widget id
     */
  }, {
    key: "getComponent",
    value: function getComponent(widgetId) {
      var _this$refs$widgetId;
      return (_this$refs$widgetId = this.refs[widgetId]) === null || _this$refs$widgetId === void 0 ? void 0 : _this$refs$widgetId.current;
    }

    /**
     * Updates a widget.
     *
     * @param widgetConfig
     */
  }, {
    key: "updateWidget",
    value: function updateWidget(widgetConfig) {
      this.widgets[widgetConfig.id] = this.newWidget(widgetConfig);
      return this.widgets[widgetConfig.id];
    }

    /**
     * Creates a new widget according to `widgetConfig`.
     *
     * @param widgetConfig
     */
  }, {
    key: "newWidget",
    value: function newWidget(widgetConfig) {
      var WidgetToComponent = this.WidgetToComponent;
      return /*#__PURE__*/React.createElement(WidgetToComponent, {
        widgetConfig: widgetConfig
      });
    }
  }]);
  return WidgetFactory;
}();
var _default = WidgetFactory;
exports["default"] = _default;
//# sourceMappingURL=WidgetFactory.js.map