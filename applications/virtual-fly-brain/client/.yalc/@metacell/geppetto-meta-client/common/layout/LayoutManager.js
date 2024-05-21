"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLayoutManagerInstance = void 0;
exports.initLayoutManager = initLayoutManager;
var React = _interopRequireWildcard(require("react"));
var FlexLayout = _interopRequireWildcard(require("@metacell/geppetto-meta-ui/flex-layout/src/index"));
var _Actions = _interopRequireDefault(require("@metacell/geppetto-meta-ui/flex-layout/src/model/Actions"));
var _DockLocation = _interopRequireDefault(require("@metacell/geppetto-meta-ui/flex-layout/src/DockLocation"));
var _model = require("./model");
var _styles = require("@material-ui/core/styles");
var _WidgetFactory = _interopRequireDefault(require("./WidgetFactory"));
var _TabsetIconFactory = _interopRequireDefault(require("./TabsetIconFactory"));
var _defaultLayout = _interopRequireDefault(require("./defaultLayout"));
var _utils = require("./utils");
var GeppettoActions = _interopRequireWildcard(require("../actions"));
var _actions2 = require("./actions");
var _MinimizeHelper = require("./helpers/MinimizeHelper");
var _FlexLayoutHelper = require("./helpers/FlexLayoutHelper");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var styles = function styles(theme) {
  return (0, _styles.createStyles)({
    container: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      position: 'relative'
    },
    spacer: {
      width: theme.spacing(1)
    },
    flexlayout: {
      flexGrow: 1,
      position: 'relative'
    }
  });
};
var instance = null;

/**
 * Wraps the FlexLayout component in order to allow a declarative specification (widgets).
 * of the layout and the components displayed.
 *
 * Handles layout state update and layout import and export.
 *
 * @memberof Control
 */
var LayoutManager = /*#__PURE__*/function () {
  /**
   * Used to restore weights from the default layout
   */

  /**
   * @constructor
   * @param model
   * @param componentMap
   * @param tabsetIconFactory
   * @param isMinimizeEnabled
   */
  function LayoutManager(model, componentMap) {
    var _this = this;
    var tabsetIconFactory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var isMinimizeEnabled = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    _classCallCheck(this, LayoutManager);
    _defineProperty(this, "model", void 0);
    _defineProperty(this, "defaultWeights", {});
    _defineProperty(this, "widgetFactory", void 0);
    _defineProperty(this, "tabsetIconFactory", void 0);
    _defineProperty(this, "store", void 0);
    _defineProperty(this, "layoutManager", this);
    _defineProperty(this, "minimizeHelper", void 0);
    _defineProperty(this, "onRenderTabSet", function (panel, renderValues, tabSetButtons) {
      if (panel.getType() === 'tabset') {
        _this.minimizeHelper.addMinimizeButtonToTabset(panel, renderValues);
        if (Array.isArray(tabSetButtons) && tabSetButtons.length > 0) {
          tabSetButtons.forEach(function (Button) {
            renderValues.stickyButtons.push( /*#__PURE__*/React.createElement(Button, {
              key: panel.getId(),
              panel: panel
            }));
          });
        }
      }
    });
    _defineProperty(this, "onRenderTab", function (panel, renderValues, tabButtons) {
      if (panel.getType() === 'tab') {
        if (Array.isArray(tabButtons) && tabButtons.length > 0) {
          tabButtons.forEach(function (Button) {
            renderValues.buttons.push( /*#__PURE__*/React.createElement(Button, {
              key: panel.getId(),
              panel: panel
            }));
          });
        }
      }
    });
    _defineProperty(this, "Component", function (layoutManager, config) {
      return function (_ref) {
        var classes = _ref.classes;
        return /*#__PURE__*/React.createElement("div", {
          className: classes.container
        }, /*#__PURE__*/React.createElement("div", {
          className: classes.flexlayout
        }, /*#__PURE__*/React.createElement(FlexLayout.Layout, {
          model: _this.model,
          factory: _this.factory,
          icons: config === null || config === void 0 ? void 0 : config.icons
          // iconFactory={layoutManager.iconFactory.bind(this)}
          ,
          onAction: function onAction(action) {
            return layoutManager.onAction(action);
          },
          onRenderTab: function onRenderTab(node, renderValues) {
            return layoutManager.onRenderTab(node, renderValues, config === null || config === void 0 ? void 0 : config.tabButtons);
          },
          onRenderTabSet: function onRenderTabSet(node, renderValues) {
            layoutManager.onRenderTabSet(node, renderValues, config === null || config === void 0 ? void 0 : config.tabSetButtons);
          }
        })));
      };
    });
    _defineProperty(this, "getComponent", function (config) {
      return (0, _styles.withStyles)(styles)(_this.Component(_this, config));
    });
    _defineProperty(this, "middleware", function (store) {
      return function (next) {
        return function (action) {
          if (!_this.store) {
            next((0, _actions2.setLayout)(_this.model.toJson()));
          }

          // This is a hack to unlock transitory state in the model before any other action is dispatched. See https://metacell.atlassian.net/browse/GEP-126
          _this.model.doAction(_Actions["default"].UPDATE_MODEL_ATTRIBUTES, {});
          _this.store = store;
          _this.widgetFactory.setStore(store);
          _this.minimizeHelper.setStore(store);
          var nextAction = true;
          var nextSetLayout = true;
          switch (action.type) {
            case _actions2.layoutActions.ADD_WIDGET:
              {
                _this.addWidget(action.data);
                break;
              }
            case _actions2.layoutActions.ADD_WIDGETS:
              {
                _this.addWidgets(action.data);
                break;
              }
            case _actions2.layoutActions.UPDATE_WIDGET:
              {
                var updatedWidget = _this.updateWidget(action.data);
                action = _objectSpread(_objectSpread({}, action), {}, {
                  data: updatedWidget
                });
                break;
              }
            case _actions2.layoutActions.DESTROY_WIDGET:
              {
                var widget = action.data;
                _this.deleteWidget(widget);
                break;
              }
            case _actions2.layoutActions.REMOVE_WIDGET:
              {
                break;
              }
            case _actions2.layoutActions.ACTIVATE_WIDGET:
              {
                action.data.status = _model.WidgetStatus.ACTIVE;
                var _widget = _this.getWidget(action.data.id);
                _widget.status = _model.WidgetStatus.ACTIVE;
                _this.updateWidget(_widget);
                break;
              }
            case _actions2.layoutActions.SET_WIDGETS:
              {
                var newWidgets = action.data;
                var _iterator = _createForOfIteratorHelper(_this.getWidgets()),
                  _step;
                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var _widget2 = _step.value;
                    if (!newWidgets[_widget2.id]) {
                      _this.deleteWidget(_widget2);
                    }
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
                _this.addWidgets(Object.values(newWidgets));
                break;
              }
            case _actions2.layoutActions.SET_LAYOUT:
              {
                next((0, _actions2.setLayout)(action.data));
                return;
              }
            case GeppettoActions.IMPORT_APPLICATION_STATE:
              {
                var incomingState = action.data.redux.layout;
                _this.model = FlexLayout.Model.fromJson(incomingState);
                _this.minimizeHelper = new _MinimizeHelper.MinimizeHelper(_this.minimizeHelper.getIsMinimizeEnabled(), _this.model);
                _this.importSession(action.data.sessions);
                nextSetLayout = false;
              }
            default:
              {
                nextSetLayout = false;
              }
          }
          if (nextAction) {
            next(action);
          }
          if (nextSetLayout) {
            _this.fixRowRecursive(_this.model._root);
            next((0, _actions2.updateLayout)(_this.model));
          }
        };
      };
    });
    this.setLayout(model);
    this.widgetFactory = new _WidgetFactory["default"](componentMap);
    this.tabsetIconFactory = tabsetIconFactory ? tabsetIconFactory : new _TabsetIconFactory["default"]();
    this.middleware = this.middleware.bind(this);
    this.factory = this.factory.bind(this);
    this.minimizeHelper = new _MinimizeHelper.MinimizeHelper(isMinimizeEnabled, this.model);
  }
  _createClass(LayoutManager, [{
    key: "setLayout",
    value: function setLayout(model) {
      this.model = FlexLayout.Model.fromJson(model || _defaultLayout["default"]);
      var allNodes = Object.values(this.model._idMap);
      for (var _i = 0, _allNodes = allNodes; _i < _allNodes.length; _i++) {
        var node = _allNodes[_i];
        this.defaultWeights[node.getId()] = node._getAttr("weight");
      }
      this.fixRowRecursive(this.model._root);
    }

    /**
     * Adds a widget to the layout.
     *
     * @param {Widget} widgetConfiguration widget to add
     */
  }, {
    key: "addWidget",
    value: function addWidget(widgetConfiguration) {
      var _widgetConfiguration$;
      if (this.getWidget(widgetConfiguration.id) && this.model.getNodeById(widgetConfiguration.id)) {
        return this.updateWidget(widgetConfiguration);
      }
      var model = this.model;
      var tabset = model.getNodeById(widgetConfiguration.panelName);
      if (tabset === undefined) {
        (0, _FlexLayoutHelper.createTabSet)(this.model, widgetConfiguration.panelName, widgetConfiguration.defaultPosition, widgetConfiguration.defaultWeight);
      }
      widgetConfiguration.pos = (_widgetConfiguration$ = widgetConfiguration.pos) !== null && _widgetConfiguration$ !== void 0 ? _widgetConfiguration$ : tabset.getChildren().length;
      this.model.doAction(_Actions["default"].addNode((0, _utils.widget2Node)(widgetConfiguration), widgetConfiguration.panelName, _DockLocation["default"].CENTER, widgetConfiguration.pos, widgetConfiguration.status == _model.WidgetStatus.ACTIVE));
    }

    /**
     * Handle rendering of tab set.
     *
     * @param panel
     * @param renderValues
     * @param tabSetButtons
     */
  }, {
    key: "exportSession",
    value:
    /**
     * Export a session.
     */
    function exportSession() {
      var confs = {};
      var components = this.widgetFactory.getComponents();
      for (var wid in components) {
        confs[wid] = components[wid].exportSession();
      }
      return confs;
    }

    /**
     * Import a widget session.
     *
     * @param {string} widgetId id of widget
     * @param conf widget configuration
     */
  }, {
    key: "importWidgetSession",
    value: function importWidgetSession(widgetId, conf) {
      var _this2 = this;
      var component = this.widgetFactory.getComponent(widgetId);
      if (component) {
        try {
          component.importSession(conf);
        } catch (e) {
          console.error('Error importing session for', widgetId, e);
        }
      } else {
        // The component may not be yet initialized when loading the session
        setTimeout(function () {
          return _this2.importWidgetSession(widgetId, conf);
        }, 100);
      }
    }

    /**
     * Import complete session.
     *
     * @param confs configuration map
     */
  }, {
    key: "importSession",
    value: function importSession(confs) {
      var imported = new Set();
      for (var wid in confs) {
        this.importWidgetSession(wid, confs[wid]);
        imported.add(wid);
      }

      // Some components may have a current status here but no state exported in the session file
      for (var _wid in this.widgetFactory.getComponents()) {
        if (!imported.has(_wid)) {
          this.importWidgetSession(_wid, null);
        }
      }
    }

    /**
     * Layout manager Redux middleware.
     * Sets the layout from Redux actions.
     *
     * @memberof Control
     * @memberof Control
     */
  }, {
    key: "restoreWeight",
    value: function restoreWeight(node) {
      if (node._getAttr("weight") == 0) {
        var _this$defaultWeights$;
        node._setWeight((_this$defaultWeights$ = this.defaultWeights[node.getId()]) !== null && _this$defaultWeights$ !== void 0 ? _this$defaultWeights$ : 50);
      }
      if (node.getParent()) {
        this.restoreWeight(node.getParent());
      }
    }
  }, {
    key: "fixRowRecursive",
    value: function fixRowRecursive(node) {
      if (node.getType() === "row" || node.getType() === "tabset") {
        if (node.getChildren().length === 0) {
          node._setWeight(0);
          return true;
        } else {
          var empty = true;
          var _iterator2 = _createForOfIteratorHelper(node.getChildren()),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var child = _step2.value;
              empty = this.fixRowRecursive(child) && empty;
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          if (!empty) {
            this.restoreWeight(node);
          } else {
            node._setWeight(0);
          }
          return empty;
        }
      }
      return false;
    }

    /**
     * Add a list of widgets.
     *
     * @param {Array<Widget>} newWidgets list of widgets
     * @private
     */
  }, {
    key: "addWidgets",
    value: function addWidgets(newWidgets) {
      var actives = [];
      var _iterator3 = _createForOfIteratorHelper(newWidgets),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var widget = _step3.value;
          if (widget.status == _model.WidgetStatus.ACTIVE) {
            actives.push(widget.id);
          }
          this.addWidget(widget);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      for (var _i2 = 0, _actives = actives; _i2 < _actives.length; _i2++) {
        var active = _actives[_i2];
        this.model.doAction(FlexLayout.Actions.selectTab(active));
      }
    }

    /**
     * Delete a widget.
     *
     * @param widget
     * @private
     */
  }, {
    key: "deleteWidget",
    value: function deleteWidget(widget) {
      this.model.doAction(_Actions["default"].deleteTab(widget.id));
    }

    /**
     * Return widgets.
     *
     * @private
     */
  }, {
    key: "getWidgets",
    value: function getWidgets() {
      return Object.values(this.store.getState().widgets);
    }

    /**
     * Get specific widget.
     *
     * @param id
     * @private
     */
  }, {
    key: "getWidget",
    value: function getWidget(id) {
      return (0, _utils.getWidget)(this.store, id);
    }

    /**
     * Handles state update related to actions in the flex layout
     * (e.g. select or move tab)
     *
     * @memberof Control
     * @param action
     */
  }, {
    key: "onAction",
    value: function onAction(action) {
      var oldModel = this.model.toJson();
      var defaultAction = true;
      switch (action.type) {
        case _Actions["default"].SET_ACTIVE_TABSET:
          break;
        case _Actions["default"].SELECT_TAB:
          var widget = this.getWidget(action.data.tabNode);
          if (widget && widget.status === _model.WidgetStatus.MINIMIZED) {
            this.minimizeHelper.restoreWidget(widget);
          }
          break;
        case _Actions["default"].DELETE_TAB:
          {
            if (this.getWidget(action.data.node).hideOnClose) {
              // widget only minimized, won't be removed from layout nor widgets list
              this.minimizeHelper.minimizeWidget(action.data.node);
              defaultAction = false;
            } else {
              // remove widget from widgets list
              this.store.dispatch((0, _actions2.removeWidgetFromStore)(action.data.node));
            }
            break;
          }
        case _Actions["default"].MAXIMIZE_TOGGLE:
          // reminder, widgets are not maximised but tabsets are
          break;
        case _Actions["default"].RENAME_TAB:
          break;
        case _Actions["default"].ADJUST_SPLIT:
          break;
        case _Actions["default"].ADD_NODE:
          {
            break;
          }
        case _Actions["default"].MOVE_NODE:
          {
            break;
          }
        default:
          {
            this.model.doAction(action);
          }
      }
      if (defaultAction) {
        this.model.doAction(action);
      }
      this.fixRowRecursive(this.model._root);
      var newModel = this.model.toJson();
      if (oldModel !== newModel) {
        this.store.dispatch((0, _actions2.updateLayout)(this.model));
      }
    }

    /**
     * Update a widget.
     *
     * @param widget
     * @private
     */
  }, {
    key: "updateWidget",
    value: function updateWidget(widget) {
      var model = this.model;
      var previousWidget = this.getWidget(widget.id);
      var mergedWidget = _objectSpread(_objectSpread({}, previousWidget), widget);
      var widgetRestored = this.minimizeHelper.restoreWidgetIfNecessary(previousWidget, mergedWidget);
      if (!widgetRestored) {
        (0, _FlexLayoutHelper.moveWidget)(model, mergedWidget);
      }
      this.widgetFactory.updateWidget(mergedWidget);
      var node = this.model.getNodeById(widget.id);
      if (node) {
        model.doAction(_Actions["default"].updateNodeAttributes(mergedWidget.id, (0, _utils.widget2Node)(mergedWidget)));
        if (mergedWidget.status == _model.WidgetStatus.ACTIVE) {
          model.doAction(FlexLayout.Actions.selectTab(mergedWidget.id));
        }
        if (widget.status == _model.WidgetStatus.MAXIMIZED && !node.getParent().isMaximized() || widget.status == _model.WidgetStatus.ACTIVE && node.getParent().isMaximized()) {
          this.model.doAction(FlexLayout.Actions.maximizeToggle(node.getParent().getId()));
        } else if (widget.status == _model.WidgetStatus.MINIMIZED && !this.minimizeHelper.isMinimized(widget)) {
          this.minimizeHelper.minimizeWidget(node.getId());
        }
      }
      return mergedWidget;
    }

    /**
     * Create widget for node.
     *
     * @param node
     */
  }, {
    key: "factory",
    value: function factory(node) {
      return this.widgetFactory.factory(node.getConfig());
    }

    /**
     * Create icon for node.
     *
     * @param node
     */
  }, {
    key: "iconFactory",
    value: function iconFactory(node) {
      // TODO move to newest flexlayout-react to add this functionality when needed
      return this.tabsetIconFactory.factory(node.getConfig());
    }
  }]);
  return LayoutManager;
}();
function initLayoutManager(model, componentMap, iconFactory, isMinimizeEnabled) {
  instance = new LayoutManager(model, componentMap, iconFactory, isMinimizeEnabled);
  return instance;
}
var getLayoutManagerInstance = function getLayoutManagerInstance() {
  return instance;
};
exports.getLayoutManagerInstance = getLayoutManagerInstance;
//# sourceMappingURL=LayoutManager.js.map