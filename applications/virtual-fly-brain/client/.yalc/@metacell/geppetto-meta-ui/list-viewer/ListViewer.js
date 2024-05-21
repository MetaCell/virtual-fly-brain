"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultColumnConfiguration = exports["default"] = exports.WrapperComponent = exports.ParameterInputComponent = exports.MultiStatusComponent = exports.LinkComponent = exports.ImageComponent = exports.IconComponent = exports.GroupComponent = exports.ColorComponent = void 0;
var _react = _interopRequireDefault(require("react"));
var _griddleReact = require("griddle-react");
var _Griddle = _interopRequireDefault(require("./utils/Griddle"));
var _BaseIconComponent = _interopRequireDefault(require("./BaseIconComponent"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _PopupColorPicker = _interopRequireDefault(require("./PopupColorPicker"));
require("./listviewer.less");
var _utils = require("./utils");
var _excluded = ["events"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
/**
 * Allows to group multiple components in a single column
 * @param {*} conf
 */
var GroupComponent = exports.GroupComponent = function GroupComponent(conf) {
  return function (_ref) {
    var value = _ref.value;
    return conf.map(function (_ref2) {
      var id = _ref2.id,
        customComponent = _ref2.customComponent,
        configuration = _ref2.configuration,
        source = _ref2.source,
        visible = _ref2.visible;
      if (value.get) {
        // is a map coming from griddle. instanceof Map does not work here
        value = (0, _utils.mapToObject)(value);
      }
      if (visible !== undefined) {
        var isVisible = visible instanceof Function ? visible(value) : visible;
        if (!isVisible) {
          return '';
        }
      }
      if (!customComponent) {
        customComponent = WrapperComponent;
      }
      if (configuration) {
        customComponent = customComponent(configuration);
      }
      var componentValue = source ? (0, _utils.mapSourceToRow)(source, value) : value;
      return /*#__PURE__*/_react["default"].createElement(customComponent, {
        key: id,
        value: componentValue
      });
    });
  };
};

/**
 * Shows a fontAwesome icon. Allows an action to be specified
 * @param { icon, action, color, tooltip }
 */
var IconComponent = exports.IconComponent = function IconComponent(_ref3) {
  var icon = _ref3.icon,
    _action = _ref3.action,
    color = _ref3.color,
    tooltip = _ref3.tooltip;
  return function (_ref4) {
    var value = _ref4.value;
    return /*#__PURE__*/_react["default"].createElement(_BaseIconComponent["default"], {
      color: color,
      title: tooltip,
      action: function action() {
        return _action(value);
      },
      icon: icon
    });
  };
};
var MultiStatusComponent = exports.MultiStatusComponent = function MultiStatusComponent(availableStatuses) {
  return /*#__PURE__*/function (_React$Component) {
    function Comp(props) {
      var _this;
      _classCallCheck(this, Comp);
      _this = _callSuper(this, Comp, [props]);
      // State contains the index of a circular list
      _this.state = {
        statusIdx: 0
      };
      _this.value = props.value;
      return _this;
    }
    _inherits(Comp, _React$Component);
    return _createClass(Comp, [{
      key: "render",
      value: function render() {
        var _this2 = this;
        var statusIdx = this.state.statusIdx;
        var _availableStatuses$th = availableStatuses[this.state.statusIdx],
          tooltip = _availableStatuses$th.tooltip,
          icon = _availableStatuses$th.icon,
          _action2 = _availableStatuses$th.action,
          color = _availableStatuses$th.color;
        return /*#__PURE__*/_react["default"].createElement(_BaseIconComponent["default"], {
          color: color,
          title: tooltip,
          action: function action() {
            _this2.setState({
              statusIdx: statusIdx + 1 < availableStatuses.length ? statusIdx + 1 : 0
            });
            _action2(_this2.value);
          },
          icon: icon
        });
      }
    }]);
  }(_react["default"].Component);
};

/**
 * Wraps a component implementing a click action on it.
 * @param {*} action
 * @param {*} customComponent
 */
var WrapperComponent = exports.WrapperComponent = function WrapperComponent(action, customComponent) {
  return function (_ref5) {
    var value = _ref5.value;
    return /*#__PURE__*/_react["default"].createElement("span", {
      onClick: function onClick() {
        return action(value);
      }
    }, customComponent ? /*#__PURE__*/_react["default"].createElement(customComponent, {
      value: value
    }) : value);
  };
};

/**
 * Shows an image from the data field. If the data field has no value, a default image is shown instead.
 *
 * @param { title, alt, defaultImg, action } configuration
 */
var ImageComponent = exports.ImageComponent = function ImageComponent(_ref6) {
  var title = _ref6.title,
    alt = _ref6.alt,
    defaultImg = _ref6.defaultImg,
    action = _ref6.action;
  return function (_ref7) {
    var value = _ref7.value;
    return /*#__PURE__*/_react["default"].createElement("img", {
      src: value ? value : defaultImg,
      title: title,
      alt: alt ? alt : title,
      onClick: function onClick() {
        return action(value);
      },
      className: "thumbnail-img"
    });
  };
};

/**
 * Allows to specify an input field.
 *
 * The value can be processed on the onBlur action
 *
 * @param { placeholder, onBlur, onKeyPress, readOnly, classString, unit, defaultValue } configuration
 */
var ParameterInputComponent = exports.ParameterInputComponent = function ParameterInputComponent(_ref8) {
  var placeholder = _ref8.placeholder,
    _onBlur = _ref8.onBlur,
    _onKeyPress = _ref8.onKeyPress,
    readOnly = _ref8.readOnly,
    classString = _ref8.classString,
    unit = _ref8.unit,
    defaultValue = _ref8.defaultValue;
  return function (_ref9) {
    var value = _ref9.value;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("input", {
      placeholder: placeholder,
      defaultValue: defaultValue instanceof Function ? defaultValue(value) : defaultValue,
      onBlur: function onBlur(evt) {
        return _onBlur(value, evt.target.value);
      },
      onKeyPress: function onKeyPress(evt) {
        return _onKeyPress(value, evt.target.value);
      },
      className: classString,
      title: "",
      readOnly: readOnly
    }), /*#__PURE__*/_react["default"].createElement("span", {
      className: "control-panel-parameter-unit"
    }, unit));
  };
};
var ColorComponent = exports.ColorComponent = function ColorComponent(_ref10) {
  var _action3 = _ref10.action,
    defaultColor = _ref10.defaultColor,
    icon = _ref10.icon;
  return function (_ref11) {
    var value = _ref11.value;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_PopupColorPicker["default"], {
      color: (0, _utils.isString)(defaultColor) ? defaultColor : defaultColor(value),
      action: function action(hex) {
        return _action3(_objectSpread(_objectSpread({}, (0, _utils.isString)(value) ? {
          path: value
        } : value), {}, {
          color: hex
        }));
      },
      icon: icon
    }));
  };
};
/**
 * Shows the data value as a link
 */
var LinkComponent = exports.LinkComponent = function LinkComponent(_ref12) {
  var text = _ref12.text;
  return function (_ref13) {
    var value = _ref13.value;
    return /*#__PURE__*/_react["default"].createElement("a", {
      href: value,
      target: "_blank",
      rel: "noopener noreferrer"
    }, text ? text : value);
  };
};
var defaultColumnConfiguration = exports.defaultColumnConfiguration = [{
  id: 'path',
  title: 'Path',
  source: 'path'
}, {
  id: 'metaType',
  title: 'Meta Type',
  source: 'metaType'
}, {
  id: 'type',
  title: 'Type',
  source: 'type'
}];
var ListViewer = exports["default"] = /*#__PURE__*/function (_React$Component2) {
  function ListViewer(props, context) {
    var _this3;
    _classCallCheck(this, ListViewer);
    _this3 = _callSuper(this, ListViewer, [props, context]);
    _defineProperty(_this3, "builtInComponents", {
      GroupComponent: GroupComponent,
      IconComponent: IconComponent,
      WrapperComponent: WrapperComponent,
      LinkComponent: LinkComponent,
      ImageComponent: ImageComponent
    });
    _this3.preprocessColumnConfiguration = _this3.preprocessColumnConfiguration.bind(_this3);
    _this3.handlerObject = _this3.props.handler;
    return _this3;
  }
  _inherits(ListViewer, _React$Component2);
  return _createClass(ListViewer, [{
    key: "getColumnConfiguration",
    value: function getColumnConfiguration() {
      return this.preprocessColumnConfiguration(this.props.columnConfiguration !== undefined ? this.props.columnConfiguration : defaultColumnConfiguration);
    }
  }, {
    key: "getData",
    value: function getData() {
      return (0, _utils.extractGriddleData)(this.props.filter ? this.props.instances.filter(this.props.filter) : this.props.instances, this.getColumnConfiguration());
    }

    /**
     * Parses the configuration for further processing, inserting defaults and adjusting types
     * @param {id, action, customComponent, configuration} colConf
     */
  }, {
    key: "preprocessColumnConfiguration",
    value: function preprocessColumnConfiguration(conf) {
      if (this.incrementalId === undefined) {
        this.incrementalId = 0;
      }
      if (conf instanceof Array) {
        return conf.map(this.preprocessColumnConfiguration);
      }
      if (conf.configuration && !conf.customComponent) {
        console.warn('Configuration was specified for column', conf.id, 'but no customComponent was specified.');
      }
      return _objectSpread(_objectSpread({}, conf), {}, {
        id: conf.id ? conf.id : this.incrementalId++,
        action: conf.action === undefined ? undefined : this.preprocessAction(conf.action),
        onBlur: conf.onBlur === undefined ? undefined : this.preprocessAction(conf.onBlur),
        onChange: conf.onChange === undefined ? undefined : this.preprocessAction(conf.onChange),
        onKeyPress: conf.onKeyPress === undefined ? undefined : this.preprocessAction(conf.onKeyPress),
        customComponent: conf.customComponent === undefined ? undefined : this.preprocessComponent(conf.customComponent),
        configuration: conf.configuration === undefined ? undefined : this.preprocessColumnConfiguration(conf.configuration)
      });
    }
  }, {
    key: "preprocessAction",
    value: function preprocessAction(action) {
      var _this4 = this;
      if ((0, _utils.isString)(action)) {
        if (!this.handlerObject[action]) {
          throw new Error('Bad ListViewer configuration: the function ' + action + ' is not defined in the specified handler ' + this.handlerObject);
        }
        return function (entity) {
          return _this4.handlerObject[action](entity);
        };
      } else {
        return action.bind(this.handlerObject);
      }
    }
  }, {
    key: "preprocessComponent",
    value: function preprocessComponent(customComponent) {
      if ((0, _utils.isString)(customComponent)) {
        if (this.builtInComponents[customComponent]) {
          return this.builtInComponents[customComponent];
        } else if (window[customComponent]) {
          return window[customComponent];
        } else {
          throw new Error('ListViewer configuration error: ' + customComponent + ' not defined. Try attach to the global (window) context or pass the imported object instead.');
        }
      }
      return customComponent;
    }
  }, {
    key: "getFilterFn",
    value: function getFilterFn() {
      return this.props.filterFn ? this.props.filterFn : function () {
        return true;
      };
    }

    /**
     * <ColumnDefinition key="path" id="path" customComponent={CustomColumn} />,
     * <ColumnDefinition key="controls" id="actions" customHeadingComponent={CustomHeading} customComponent={CustomActions(buttonsConf)} />
     * @param {*} param0
     */
  }, {
    key: "getColumnDefinition",
    value: function getColumnDefinition(conf) {
      var id = conf.id,
        customComponent = conf.customComponent,
        configuration = conf.configuration,
        action = conf.action;
      if (configuration && customComponent) {
        customComponent = customComponent(configuration);
      }
      if (action && !customComponent) {
        customComponent = WrapperComponent(action, customComponent);
      }
      return /*#__PURE__*/_react["default"].createElement(_griddleReact.ColumnDefinition, _objectSpread(_objectSpread({}, conf), {}, {
        key: id,
        configuration: undefined,
        customComponent: customComponent,
        source: undefined
      }));
    }
  }, {
    key: "getColumnDefinitions",
    value: function getColumnDefinitions() {
      var _this5 = this;
      return this.getColumnConfiguration().map(function (colConf) {
        return _this5.getColumnDefinition(colConf);
      });
    }
  }, {
    key: "getLayout",
    value: function getLayout() {
      var _this6 = this;
      if (this.props.layout) {
        return this.props.layout;
      }
      return function (_ref14) {
        var Table = _ref14.Table,
          Pagination = _ref14.Pagination,
          Filter = _ref14.Filter,
          SettingsWrapper = _ref14.SettingsWrapper;
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "listviewer-container"
        }, /*#__PURE__*/_react["default"].createElement(Filter, null), /*#__PURE__*/_react["default"].createElement(Table, null), _this6.props.showPagination === false ? null : /*#__PURE__*/_react["default"].createElement(Pagination, null));
      };
    }
  }, {
    key: "getPlugins",
    value: function getPlugins() {
      var _this$props = this.props,
        _this$props$remoteInf = _this$props.remoteInfiniteScroll,
        remoteInfiniteScroll = _this$props$remoteInf === void 0 ? false : _this$props$remoteInf,
        _this$props$plugins = _this$props.plugins,
        extraPlugins = _this$props$plugins === void 0 ? [] : _this$props$plugins;
      if (remoteInfiniteScroll) {
        return [_griddleReact.plugins.PositionPlugin({
          disablePointerEvents: true
        })].concat(_toConsumableArray(extraPlugins));
      }
      return this.props.infiniteScroll ? [_griddleReact.plugins.LocalPlugin, _griddleReact.plugins.PositionPlugin({
        disablePointerEvents: true
      })].concat(_toConsumableArray(extraPlugins)) : [_griddleReact.plugins.LocalPlugin].concat(_toConsumableArray(extraPlugins));
    }
  }, {
    key: "render",
    value: function render() {
      var customComponents = this.props.customComponents ? this.props.customComponents : {};
      var _this$props2 = this.props,
        events = _this$props2.events,
        others = _objectWithoutProperties(_this$props2, _excluded);
      return /*#__PURE__*/_react["default"].createElement("section", {
        className: this.props.className ? this.props.className : "listviewer"
      }, /*#__PURE__*/_react["default"].createElement(_Griddle["default"], {
        data: this.getData(),
        plugins: this.getPlugins(),
        components: _objectSpread({
          Layout: this.getLayout()
        }, customComponents),
        events: _objectSpread({}, events)
      }, /*#__PURE__*/_react["default"].createElement(_griddleReact.RowDefinition, null, this.getColumnDefinitions())));
    }
  }]);
}(_react["default"].Component);
ListViewer.defaultProps = {
  handler: {}
};
ListViewer.propTypes = {
  /**
   * Instances object
   */
  instances: _propTypes["default"].array.isRequired,
  /**
   * Specifies a handler context to which the callbacks specified are bound
   */
  handler: _propTypes["default"].object,
  /**
   * Bool that defines the presence or not of infiniteScroll
   */
  infiniteScroll: _propTypes["default"].bool,
  /**
   * Specifies custom column definitions
   */
  columnConfiguration: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    /**
     * Column identifier
     */
    id: _propTypes["default"].string,
    /**
     * Title of the column
     */
    title: _propTypes["default"].string,
    /**
     * Source of the column
     */
    source: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].string]),
    /**
     * Custom css classname
     */
    cssClassName: _propTypes["default"].string,
    /**
     * Action associated with the column
     */
    action: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element, _propTypes["default"].func]),
    /**
     * Custom component
     */
    customComponent: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element, _propTypes["default"].func]),
    /**
     * Custom heading component
     */
    customHeadingComponent: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].element]),
    /**
     * Display name of the column
     */
    displayName: _propTypes["default"].string,
    /**
     * Boolean value for determining column visibility
     */
    visible: _propTypes["default"].bool,
    /**
     * Configuration details of the column
     */
    configuration: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].arrayOf(_propTypes["default"].object)])
  })),
  /**
   * Function to filter data given a custom criterion
   */
  filter: _propTypes["default"].func,
  /**
   * Components passed in with a matching name will override the default in Griddle
   */
  customComponents: _propTypes["default"].shape({
    /**
     * Custom components' cell type
     */
    Cell: _propTypes["default"].elementType,
    /**
     * Filter for searching custom components
     */
    Filter: _propTypes["default"].elementType,
    /**
     * Loading element
     */
    Loading: _propTypes["default"].elementType,
    /**
     * ElementType for the next button in the custom components
     */
    NextButton: _propTypes["default"].elementType,
    /**
     * ElementType for when there are no results returned from a search
     */
    NoResults: _propTypes["default"].elementType,
    /**
     * Page dropdown for the custom components
      */
    PageDropdown: _propTypes["default"].elementType,
    /**
     * Pagination for the custom components
     */
    Pagination: _propTypes["default"].elementType,
    /**
     * ElementType for the previous button in the custom components
     */
    PreviousButton: _propTypes["default"].elementType,
    /**
     * Row elementType for the custom components
     */
    Row: _propTypes["default"].elementType,
    /**
     * Definition of rows in the custom components
     */
    RowDefinition: _propTypes["default"].elementType,
    /**
     * Settings for the custom components
     */
    Settings: _propTypes["default"].elementType,
    /**
     * Settings for the List Viewer's custom component's toggle
     */
    SettingsToggle: _propTypes["default"].elementType,
    /**
     * Table for custom components
     */
    Table: _propTypes["default"].elementType,
    /**
     * Table body for custom components
     */
    TableBody: _propTypes["default"].elementType,
    /**
     * Table heading for custom components
     */
    TableHeading: _propTypes["default"].elementType,
    /**
     * Table heading for cells for custom components
     */
    TableHeadingCell: _propTypes["default"].elementType,
    /**
     * Table heading for cells in ascending order for custom components
     */
    TableHeadingCellAscending: _propTypes["default"].elementType,
    /**
     * Table heading for cells in descending order for custom components
     */
    TableHeadingCellDescending: _propTypes["default"].elementType,
    /**
     * Layout of the custom components
     */
    Layout: _propTypes["default"].elementType
  }),
  /**
   * Booleam to determine showing the Pagination button that is used for changing pages
   */
  showPagination: _propTypes["default"].bool
};
//# sourceMappingURL=ListViewer.js.map