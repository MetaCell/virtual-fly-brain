"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var util = _interopRequireWildcard(require("../../utilities"));
var _Instance = _interopRequireDefault(require("@metacell/geppetto-meta-core/model/Instance"));
var _core = require("@material-ui/core");
var _IconText = _interopRequireDefault(require("./IconText"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _ConnectivityTooltip = _interopRequireDefault(require("./ConnectivityTooltip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
var d3 = require('d3');
var styles = function styles(theme) {
  return {
    legends: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(1)
    },
    legendTitle: {
      fontSize: '14px',
      color: 'white'
    }
  };
};
var ConnectivityPlot = /*#__PURE__*/function (_Component) {
  function ConnectivityPlot(props) {
    var _this;
    _classCallCheck(this, ConnectivityPlot);
    _this = _callSuper(this, ConnectivityPlot, [props]);
    _this.height = _this.props.size.height;
    _this.width = _this.props.size.width;
    _this.linkCache = {};
    _this.defaultOptions = {
      nodeType: function nodeType(node) {
        if (node instanceof _Instance["default"]) {
          return node.getParent().getId();
        } else {
          return node.getPath().split('_')[0];
        }
      },
      linkWeight: function linkWeight(conn) {
        return 1;
      },
      linkType: function linkType(conn) {
        return 1;
      },
      library: _this.props.modelFactory.geppettoModel.common
    };
    _this.setNodeColormap(_this.props.colorMap);
    _this.subRef = /*#__PURE__*/_react["default"].createRef();
    _this.tooltipRef = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }
  _inherits(ConnectivityPlot, _Component);
  return _createClass(ConnectivityPlot, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      return this.props.toolbarVisibility === nextProps.toolbarVisibility;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setOptions();
      this.setData(this.props.data);
      this.setNodeColormap(this.props.colorMap);
      this.draw();
      this.forceUpdate();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.options !== this.props.options || prevProps.layout !== this.props.layout || this.options === null) {
        this.setOptions();
      }
      this.setData(this.props.data);
      this.setNodeColormap(this.props.colorMap);
      this.draw();
    }

    /**
     *
     * Sets connectivity auxiliary functions
     *
     * @command setOptions()
     */
  }, {
    key: "setOptions",
    value: function setOptions() {
      this.options = this.defaultOptions;
      if (this.props.linkType != null) {
        this.options.linkType = this.props.linkType;
      }
      if (this.props.nodeType != null) {
        this.options.nodeType = this.props.nodeType;
      }
      if (this.props.linkWeight != null) {
        this.options.linkWeight = this.props.linkWeight;
      }
      if (this.props.library != null) {
        this.options.library = this.props.library;
      }
    }

    /**
     *
     * Creates dataset with provided data
     *
     * @command setData(data)
     *
     * @param data
     */
  }, {
    key: "setData",
    value: function setData(data) {
      this.dataset = {};
      this.mapping = {};
      this.mappingSize = 0;
      this.dataset['root'] = data;
    }

    /**
     *
     * Sets nodeColormap
     *
     * @command setNodeColormap(nodeColormap)
     *
     * @param nodeColormap
     */
  }, {
    key: "setNodeColormap",
    value: function setNodeColormap(nodeColormap) {
      if (nodeColormap != null) {
        this.nodeColormap = nodeColormap;
      } else {
        this.nodeColormap = this.defaultColorMapFunction();
      }
    }

    /**
     *
     * Returns default colorScale
     *
     * @command defaultColorMapFunction()
     *
     */
  }, {
    key: "defaultColorMapFunction",
    value: function defaultColorMapFunction() {
      var domain = this.props.names;
      var range = this.props.colors;
      return d3.scaleOrdinal(range).domain(domain);
    }

    /**
     *
     * Creates connections and draws layout
     *
     * @command draw()
     *
     */
  }, {
    key: "draw",
    value: function draw() {
      if (this.createDataFromConnections()) {
        this.drawLayout();
      }
    }

    /**
     *
     * Creates data from connections
     *
     * @command createDataFromConnections()
     */
  }, {
    key: "createDataFromConnections",
    value: function createDataFromConnections() {
      var connectionVariables = this.props.modelFactory.getAllTypesOfType(this.options.library.connection)[0].getVariableReferences();
      if (connectionVariables.length > 0) {
        if (this.dataset['root'].getMetaType() === this.props.resources.INSTANCE_NODE) {
          var subInstances = this.dataset['root'].getChildren();
          this.dataset['nodes'] = [];
          this.dataset['links'] = [];
          for (var k = 0; k < subInstances.length; k++) {
            var subInstance = subInstances[k];
            if (subInstance.getMetaType() === this.props.resources.ARRAY_INSTANCE_NODE) {
              var populationChildren = subInstance.getChildren();
              for (var l = 0; l < populationChildren.length; l++) {
                var populationChild = populationChildren[l];
                this.createNode(populationChild.getId(), this.options.nodeType(populationChild));
              }
            }
          }
          for (var x = 0; x < connectionVariables.length; x++) {
            var connectionVariable = connectionVariables[x];
            var source = connectionVariable.getA();
            var target = connectionVariable.getB();
            var sourceId = source.getElements()[source.getElements().length - 1].getPath();
            var targetId = target.getElements()[source.getElements().length - 1].getPath();
            this.createLink(sourceId, targetId, this.options.linkType.bind(this)(connectionVariable, this.linkCache), this.options.linkWeight(connectionVariable));
          }
        }
        this.dataset.nodeTypes = util.uniq(util.pluck(this.dataset.nodes, 'type')).sort();
        this.dataset.linkTypes = util.uniq(util.pluck(this.dataset.links, 'type')).sort();
        return true;
      }
      return false;
    }

    /**
     *
     * Prepocesses node degrees
     *
     * @command calculateNodeDegrees(normalize)
     * @param normalize
     */
  }, {
    key: "calculateNodeDegrees",
    value: function calculateNodeDegrees(normalize) {
      var indegrees = util.countBy(this.dataset.links, function (link) {
        return link.source;
      });
      var outdegrees = util.countBy(this.dataset.links, function (link) {
        return link.target;
      });
      var maxDeg = 1;
      this.dataset.nodes.forEach(function (node, idx) {
        var idg = typeof indegrees[idx] === 'undefined' ? 0 : indegrees[idx];
        var odg = typeof outdegrees[idx] === 'undefined' ? 0 : outdegrees[idx];
        node.degree = idg + odg;
        if (node.degree > maxDeg) {
          maxDeg = node.degree;
        }
      });
      if (normalize) {
        this.dataset.nodes.forEach(function (node) {
          node.degree /= maxDeg;
        });
      }
    }

    /**
     *
     * Creates node
     *
     * @command createNode(id, type)
     *
     * @param id
     * @param type
     */
  }, {
    key: "createNode",
    value: function createNode(id, type) {
      if (!(id in this.mapping)) {
        var nodeItem = {
          id: id,
          type: type
        };
        this.dataset['nodes'].push(nodeItem);
        this.mapping[nodeItem['id']] = this.mappingSize;
        this.mappingSize++;
      }
    }

    /**
     *
     * Creates link
     *
     * @command createLink(sourceId, targetId, type, weight)
     *
     * @param sourceId
     * @param targetId
     * @param type
     * @param weight
     */
  }, {
    key: "createLink",
    value: function createLink(sourceId, targetId, type, weight) {
      var linkItem = {
        source: this.mapping[sourceId],
        target: this.mapping[targetId],
        type: type,
        weight: weight
      };
      this.dataset['links'].push(linkItem);
    }

    /**
     *
     * Draws the layout
     *
     * @command drawLayout()
     *
     */
  }, {
    key: "drawLayout",
    value: function drawLayout() {
      this.width = this.props.size.width;
      this.height = this.props.size.height;
      this.cleanCanvas();
      this.svg = d3.select('#' + this.props.id).append('svg').attr('width', this.width).attr('height', this.height);
      this.props.layout.draw(this);
    }

    /**
     *
     * Cleans the canvas
     *
     * @command cleanCanvas()
     *
     */
  }, {
    key: "cleanCanvas",
    value: function cleanCanvas() {
      if (this.svg) {
        this.svg.remove();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        id = _this$props.id,
        classes = _this$props.classes,
        legendsVisibility = _this$props.legendsVisibility,
        layout = _this$props.layout;
      var legends = [];
      if (layout && this.nodeColormap && this.dataset) {
        var layoutLegends = layout.getLegends(this);
        var _iterator = _createForOfIteratorHelper(layoutLegends),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var obj = _step.value;
            if (obj.title) {
              legends.push( /*#__PURE__*/_react["default"].createElement(_Typography["default"], {
                key: obj.title,
                className: classes.legendTitle,
                variant: "h6",
                gutterBottom: true
              }, obj.title));
            }
            var domain = obj.colorScale.domain().slice().sort();
            var _iterator2 = _createForOfIteratorHelper(domain.entries()),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var _step2$value = _slicedToArray(_step2.value, 2),
                  i = _step2$value[0],
                  v = _step2$value[1];
                legends.push( /*#__PURE__*/_react["default"].createElement(_IconText["default"], {
                  key: v,
                  icon: "fa fa-square-full legend-item",
                  color: obj.colorScale(i),
                  subtitle: v,
                  width: '20px',
                  height: '20px'
                }));
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      var plot = /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
        item: true,
        sm: 9,
        xs: 12
      }, /*#__PURE__*/_react["default"].createElement(_ConnectivityTooltip["default"], {
        ref: this.tooltipRef,
        layout: layout
      }), /*#__PURE__*/_react["default"].createElement("div", {
        id: id
      }));
      var show;
      if (legends.length === 0 || !legendsVisibility) {
        show = /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
          container: true
        }, plot);
      } else {
        show = /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
          container: true
        }, /*#__PURE__*/_react["default"].createElement(_Grid["default"], {
          item: true,
          sm: true,
          xs: true
        }, /*#__PURE__*/_react["default"].createElement("div", {
          ref: this.subRef
        }, legendsVisibility ? legends.map(function (entry) {
          return entry;
        }) : '')), plot);
      }
      return show;
    }
  }]);
}(_react.Component);
var _default = exports["default"] = (0, _core.withStyles)(styles)(ConnectivityPlot);
//# sourceMappingURL=ConnectivityPlot.js.map