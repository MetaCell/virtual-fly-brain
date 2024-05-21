"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _jszip = _interopRequireDefault(require("jszip"));
var _fileSaver = _interopRequireDefault(require("file-saver"));
var _core = _interopRequireDefault(require("plotly.js/lib/core"));
var _factory = _interopRequireDefault(require("react-plotly.js/factory"));
var _mathjs = require("mathjs");
var _PlotHeader = _interopRequireDefault(require("./PlotHeader"));
var _plotConfiguration = require("./configuration/plotConfiguration");
var _ExternalInstance = _interopRequireDefault(require("@metacell/geppetto-meta-core/model/ExternalInstance"));
var _core2 = require("@material-ui/core");
var _units = require("./units");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
_core["default"].register([require('plotly.js/lib/scatter')]);
var ScatterPlot = (0, _factory["default"])(_core["default"]);
var style = {
  container: {
    width: '100%',
    height: '100%'
  },
  headerIcons: {
    fontSize: '15px'
  },
  plot: {
    width: '100%',
    height: "calc(100% - 16px)"
  }
};
var PlotComponent = /*#__PURE__*/function (_Component) {
  function PlotComponent() {
    var _this;
    _classCallCheck(this, PlotComponent);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, PlotComponent, [].concat(args));
    _defineProperty(_this, "state", {});
    _defineProperty(_this, "reset", true);
    _defineProperty(_this, "revision", 0);
    _defineProperty(_this, "analysis", []);
    _defineProperty(_this, "extractLegendName", _this.props.extractLegendName ? _this.props.extractLegendName.bind(_this) : _this.extractLegendName.bind(_this));
    _defineProperty(_this, "headerIconList", [{
      icon: 'fa fa-home',
      action: function action() {
        return _this.resetAxes();
      },
      tooltip: 'Reset plot zoom'
    }, {
      icon: 'fa fa-list',
      action: function action() {
        return _this.toggleLegend();
      },
      tooltip: 'Toggle legend'
    }, {
      icon: 'fa fa-picture-o',
      action: function action(imageType) {
        return _this.downloadImage(imageType);
      },
      options: ['Save as PNG', 'Save as SVG', 'Save as JPEG'],
      tooltip: 'Save as image'
    }, {
      icon: 'fa fa-download',
      action: function action() {
        return _this.downloadPlotData();
      },
      tooltip: 'Download plot data'
    }, {
      icon: 'fa gpt-analysis',
      action: function action(analysisOption) {
        return _this.plotAverage(analysisOption);
      },
      options: ['Plot average', 'Remove analysis'],
      tooltip: 'Analysis'
    }, {
      icon: 'fa fa-history',
      action: function action() {},
      tooltip: 'Show navigation history'
    }]);
    return _this;
  }
  _inherits(PlotComponent, _Component);
  return _createClass(PlotComponent, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var plots = this.props.plots;
      if (nextProps.forceChange || plots.length != nextProps.plots.length) {
        return true;
      }
      for (var i in plots) {
        if (nextProps.plots[i].x != this.props.plots[i].x) {
          return true;
        }
        if (nextProps.plots[i].y != this.props.plots[i].y) {
          return true;
        }
        for (var key in nextProps.plots[i].lineOptions) {
          if (nextProps.plots[i].lineOptions[key] != this.props.plots[i].lineOptions[key]) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: "initPlot",
    value: function initPlot() {
      if (this.reset) {
        this.data = [];
        this.frames = [];
        this.instances = {};
        var labelX = undefined,
          labelY = undefined;
        var _iterator = _createForOfIteratorHelper(this.props.plots),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var plotDefinition = _step.value;
            if (plotDefinition) {
              var instanceY = Instances.getInstance(plotDefinition.y);
              var instanceX = Instances.getInstance(plotDefinition.x);
              var lineOptions = plotDefinition.lineOptions;
              if (!instanceY || !instanceX) {
                console.error("Instance", plotDefinition, "does not seems to contain data or time instances.");
                return;
              }
              var instanceData = this.getInstanceData(instanceY, instanceX, lineOptions);
              this.data.push(instanceData);
              var instanceLabelX = this.getUnitLabel(instanceX.getUnit());
              var instanceLabelY = this.getUnitLabel(instanceY.getUnit());
              labelY = !labelY || labelY == instanceLabelY ? instanceLabelY : "SI Units";
              labelX = !labelX || labelX == instanceLabelX ? instanceLabelX : "SI Units";
            } else {
              console.warn("No instance path defined for Plot component.");
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        this.updateLayoutConf(labelX, labelY);
      }
      this.reset = true;
    }
  }, {
    key: "getInstanceData",
    value: function getInstanceData(instanceY, instanceX, lineOptions) {
      var legendName = this.extractLegendName(instanceY);
      var trace = _objectSpread(_objectSpread({}, this.getSinglePlotConfiguration(lineOptions)), {}, {
        x: instanceX.getTimeSeries(),
        y: instanceY.getTimeSeries(),
        path: instanceY.getInstancePath(),
        name: legendName
      });
      return trace;
    }
  }, {
    key: "getUnitLabel",
    value: function getUnitLabel(unitSymbol) {
      if (unitSymbol != null || unitSymbol != undefined) {
        unitSymbol = unitSymbol.replace(/_per_/gi, " / ");
      } else {
        unitSymbol = "";
      }
      var unitLabel = unitSymbol;
      if (unitSymbol != undefined && unitSymbol != null && unitSymbol != "") {
        var formattedUnitName = "";
        if (_units.Units.hasUnit(unitSymbol)) {
          formattedUnitName = _units.Units.getUnitLabel(unitSymbol);
        } else {
          try {
            var mathUnit = (0, _mathjs.unit)(1, unitSymbol);
            formattedUnitName = mathUnit.units.length > 0 ? mathUnit.units[0].unit.base.key : "";
            mathUnit.units.length > 1 ? formattedUnitName += " OVER " + mathUnit.units[1].unit.base.key : "";
          } catch (error) {
            console.log("Unit symlob <".concat(unitSymbol, "> does not represent a physical quantity"));
          }
        }
        if (formattedUnitName != "") {
          formattedUnitName = formattedUnitName.replace(/_/g, " ");
          formattedUnitName = formattedUnitName.charAt(0).toUpperCase() + formattedUnitName.slice(1).toLowerCase();
          unitLabel = formattedUnitName + " (" + unitSymbol.replace(/-?[0-9]/g, function (letter) {
            return letter.sup();
          }) + ")";
        }
        return unitLabel;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      this.refs.plotly.resizeHandler();
    }
  }, {
    key: "updateLayoutConf",
    value: function updateLayoutConf(labelX, labelY) {
      this.layout = _objectSpread(_objectSpread(_objectSpread({}, (0, _plotConfiguration.defaultLayout)()), this.props.layout ? this.props.layout : {}), {}, {
        title: this.props.title
      });
      var layoutConf = this.getAxisLayoutConfiguration(labelX, labelY);
      this.layout.xaxis = _objectSpread(_objectSpread({}, this.layout.xaxis), layoutConf.xaxis);
      this.layout.yaxis = _objectSpread(_objectSpread({}, this.layout.yaxis), layoutConf.yaxis);
      this.layout.margin = _objectSpread(_objectSpread({}, this.layout.margin), layoutConf.margin);
      this.layout.datarevision = this.revision + 1;
      this.revision = this.revision + 1;
    }
  }, {
    key: "getAxisLayoutConfiguration",
    value: function getAxisLayoutConfiguration(labelX, labelY) {
      return {
        xaxis: {
          title: {
            text: labelX
          },
          autorange: true
        },
        yaxis: {
          title: {
            text: labelY
          },
          autorange: true
        },
        margin: {
          l: labelY == null || labelY == "" ? 30 : 50
        }
      };
    }
  }, {
    key: "getSinglePlotConfiguration",
    value: function getSinglePlotConfiguration(lineOptions) {
      var defaultConf = (0, _plotConfiguration.defaultTrace)();
      return _objectSpread(_objectSpread({}, defaultConf), {}, {
        line: lineOptions ? lineOptions : defaultConf.line
      });
    }
  }, {
    key: "extractLegendName",
    value: function extractLegendName(instanceY) {
      var legendName = instanceY.getInstancePath();
      return legendName;
    }
  }, {
    key: "toggleLegend",
    value: function toggleLegend() {
      this.layout.showlegend = !this.layout.showlegend;
      this.reset = false;
      this.forceUpdate();
    }
  }, {
    key: "resetAxes",
    value: function resetAxes() {
      this.forceUpdate();
    }
  }, {
    key: "downloadImage",
    value: function downloadImage(imageType) {
      var id = this.props.id;
      var layout = this.layout;
      imageType = imageType.replace('Save as ', '').toLowerCase();
      layout.paper_bgcolor = "rgb(255,255,255)";
      layout.xaxis.linecolor = "rgb(0,0,0)";
      layout.yaxis.linecolor = "rgb(0,0,0)";
      layout.xaxis.tickfont.color = "rgb(0,0,0)";
      layout.yaxis.tickfont.color = "rgb(0,0,0)";
      layout.yaxis.title.font.color = "rgb(0,0,0)";
      layout.xaxis.title.font.color = "rgb(0,0,0)";
      layout.xaxis.tickfont.size = 18;
      layout.yaxis.tickfont.size = 18;
      layout.xaxis.title.font.size = 18;
      layout.yaxis.title.font.size = 18;
      layout.legend.font.size = 18;
      layout.legend.font.family = 'Helvetica Neue, Helvetica, sans-serif';
      layout.legend.font.color = "rgb(0,0,0)";
      layout.legend.bgcolor = "rgb(255,255,255)";
      _core["default"].relayout(id, layout);
      _core["default"].downloadImage(id, {
        format: imageType
      });
      this.forceUpdate();
    }
  }, {
    key: "downloadPlotData",
    value: function downloadPlotData() {
      var _this2 = this;
      var data = this.data;
      var _this$props = this.props,
        plots = _this$props.plots,
        id = _this$props.id;

      // instancePaths 
      var text = plots.map(function (plot) {
        return _this2.removeLastPath(plot.y);
      });
      text.unshift(plots[0].x);
      text = text.join(' ');

      // data
      var dataToSave = data.map(function (dataset) {
        return dataset.y;
      });
      dataToSave.unshift(data[0].x);

      // convert instancePaths to bytes
      var bytesNames = new Uint8Array(text.length);
      for (var i = 0; i < text.length; i++) {
        bytesNames[i] = text.charCodeAt(i);
      }

      // arange data in table like format
      var content = "";
      for (var _i = 0; _i < dataToSave[0].length; _i++) {
        for (var j = 0; j < dataToSave.length; j++) {
          var size = dataToSave[j][_i].toString().length;
          var space = "";
          for (var l = 25; l > size; l--) {
            space += " ";
          }
          content += dataToSave[j][_i] + space;
        }
        content += "\r\n";
      }

      // convert data to bytes
      var bytesResults = new Uint8Array(content.length);
      for (var i = 0; i < content.length; i++) {
        bytesResults[i] = content.charCodeAt(i);
      }
      var zip = new _jszip["default"]();
      zip.file("outputMapping.dat", bytesNames);
      zip.file("results.dat", bytesResults);
      zip.generateAsync({
        type: "blob"
      }).then(function (blob) {
        var d = new Date();
        var n = d.getTime();
        _fileSaver["default"].saveAs(blob, id + "-" + n.toString() + ".zip");
      });
    }
  }, {
    key: "removeLastPath",
    value: function removeLastPath(path) {
      // hello.there.here.I.go => hello.there.here.I
      if (typeof path === "string" && path.length > 3 && path.indexOf('.') > -1) {
        return path.split('.').filter(function (el, index, arr) {
          return index != arr.length - 1;
        }).join('.');
      }
    }
  }, {
    key: "plotAverage",
    value: function plotAverage(actionName) {
      if (actionName.startsWith("Plot") && this.analysis.length == 0) {
        var result = [];
        var data = this.data;
        var arrays = data.map(function (dataset) {
          return dataset.y;
        });
        for (var i in arrays[0]) {
          var total = 0;
          var _iterator2 = _createForOfIteratorHelper(arrays),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var arr = _step2.value;
              total += +arr[i];
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          result.push(total / arrays.length);
        }
        var _iterator3 = _createForOfIteratorHelper(data),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var dataset = _step3.value;
            dataset.opacity = 0.4;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        this.analysis.push({
          hoverinfo: "all",
          line: {
            color: "#e27300"
          },
          mode: "lines",
          name: "Average",
          path: "",
          type: "scatter",
          x: data[0].x,
          y: result
        });
        this.forceUpdate();
      } else if (actionName.startsWith("Remove") && this.analysis.length > 0) {
        this.analysis.pop();
        this.forceUpdate();
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.initPlot();
      var _this$props2 = this.props,
        plotConfig = _this$props2.plotConfig,
        id = _this$props2.id,
        classes = _this$props2.classes;
      var data = this.data,
        layout = this.layout,
        revision = this.revision,
        analysis = this.analysis;
      var config = _objectSpread(_objectSpread({}, (0, _plotConfiguration.defaultConfig)()), plotConfig);
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: classes.container
      }, data.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
        className: classes.container
      }, /*#__PURE__*/_react["default"].createElement(_PlotHeader["default"], {
        headerIcons: this.headerIconList
      }), /*#__PURE__*/_react["default"].createElement(ScatterPlot, {
        ref: "plotly",
        divId: id,
        config: config,
        data: [].concat(_toConsumableArray(data), _toConsumableArray(analysis)),
        revision: revision,
        onDoubleClick: function onDoubleClick() {},
        layout: layout,
        useResizeHandler: true,
        className: classes.plot
      })));
    }
  }]);
}(_react.Component);
PlotComponent.defaultProp = {
  layout: {},
  extractLegendName: function extractLegendName() {}
};
PlotComponent.propTypes = {
  /**
   * The identifier used to name this Plot component.
   */
  id: _propTypes["default"].string.isRequired,
  /**
   * Array of objects, each one containing the x,y position of a point in the line/scatter plot. A third property named 
   * 'lineOptions' can be given, this will be used for modifying the visualization of the line plots.
   */
  plots: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    /**
     * The x value of the plot
     */
    x: _propTypes["default"].string.isRequired,
    /**
     * The y value of the plot
     */
    y: _propTypes["default"].string.isRequired,
    /**
     * An object specifying the line properties of the plot such as color
     */
    lineOptions: _propTypes["default"].object
  })).isRequired,
  /**
   * Configuration settings for the chart and line plots.
   * Checkout [plotly's configuration](https://plotly.com/javascript/configuration-options/) options to add in your layout object.
   */
  layout: _propTypes["default"].object,
  /**
   * Function used to retrieve the legend name of a line plot.
   */
  extractLegendName: _propTypes["default"].func
};
var _default = exports["default"] = (0, _core2.withStyles)(style)(PlotComponent);
//# sourceMappingURL=PlotComponent.js.map