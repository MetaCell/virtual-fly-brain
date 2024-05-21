"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var d3 = _interopRequireWildcard(require("d3-force-3d"));
var THREE = _interopRequireWildcard(require("three"));
var _reactForceGraph2d = _interopRequireDefault(require("react-force-graph-2d"));
var _reactForceGraph3d = _interopRequireDefault(require("react-force-graph-3d"));
var _OBJLoader = require("three/examples/jsm/loaders/OBJLoader.js");
var _utils = require("./utils");
var _excluded = ["data", "d2", "xGap", "yGap"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
var GeppettoGraphVisualization = exports["default"] = /*#__PURE__*/function (_Component) {
  function GeppettoGraphVisualization() {
    var _this;
    _classCallCheck(this, GeppettoGraphVisualization);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, GeppettoGraphVisualization, [].concat(args));
    // Ref to GGV container
    _defineProperty(_this, "ggv", /*#__PURE__*/_react["default"].createRef());
    _defineProperty(_this, "dimensions", {
      width: 200,
      height: 200
    });
    _defineProperty(_this, "font", _this.props.font || "6px Source Sans Pro");
    _defineProperty(_this, "size", _this.props.nodeRelSize || 20);
    _defineProperty(_this, "borderSize", Math.floor((_this.props.nodeRelSize || 20) * 0.1));
    // Gap to leave between lines in text inside nodes in 2D graphs
    _defineProperty(_this, "doubleGap", Math.floor((_this.props.nodeRelSize || 20) * 0.25));
    _defineProperty(_this, "tripleGap", Math.floor((_this.props.nodeRelSize || 20) * 0.35));
    _defineProperty(_this, "timeToCenter2DCamera", _this.props.timeToCenter2DCamera || 0);
    _defineProperty(_this, "getNodeLabel", _this.props.nodeLabel ? _this.fnOrField(_this.props.nodeLabel) : function (node) {
      return node.name;
    });
    _defineProperty(_this, "getLinkLabel", _this.props.linkLabel ? _this.fnOrField(_this.props.linkLabel) : function (link) {
      return link.name;
    });
    _defineProperty(_this, "getLinkWidth", _this.props.linkWidth ? _this.props.linkWidth instanceof Function ? _this.props.linkWidth : function () {
      return _this.props.linkWidth;
    } : function () {
      return 0.25;
    });
    _defineProperty(_this, "getLinkColor", _this.props.linkColor ? _this.props.linkColor instanceof Function ? _this.props.linkColor : function () {
      return _this.props.linkColor;
    } : function () {
      return 'white';
    });
    _defineProperty(_this, "getNodeColor", _this.props.nodeColor ? _this.props.nodeColor instanceof Function ? _this.props.nodeColor : function () {
      return _this.props.nodeColor;
    } : function () {
      return '#6520ff';
    });
    _defineProperty(_this, "getNodeLabelColor", _this.props.nodeLabelColor ? _this.props.nodeLabelColor instanceof Function ? _this.props.nodeLabelColor : function () {
      return _this.props.nodeLabelColor;
    } : function () {
      return '#ffffff';
    });
    // wireframe the loaded obj file 
    _defineProperty(_this, "wireframeAnObject", function (object) {
      var _this$props$wireframe = _this.props.wireframeColor,
        wireframeColor = _this$props$wireframe === void 0 ? 0x6893DE : _this$props$wireframe;
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          var geometry = child.geometry,
            material = child.material;
          var mesh = new THREE.Mesh(geometry, material);
          window.scene.add(mesh);
          mesh.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material.wireframe = true;
              child.material.color = new THREE.Color(wireframeColor);
            }
          });
        }
      });
    });
    // nodes with defined position, will not be draggable
    _defineProperty(_this, "onNodeDrag", function (node) {
      if (node.position) {
        node.fx = node.position.x;
        node.fy = node.position.y;
        node.fz = node.position.z;
      }
    });
    // nodes with defined position, will not have forces applied to them
    _defineProperty(_this, "addFixedPositionToNodes", function (data) {
      data.nodes.forEach(function (node) {
        if (node.position) {
          node.fx = node.position.x;
          node.fy = node.position.y;
          node.fz = node.position.z;
        }
      });
    });
    return _this;
  }
  _inherits(GeppettoGraphVisualization, _Component);
  return _createClass(GeppettoGraphVisualization, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
        data = _this$props.data,
        url = _this$props.url;
      if (this.props.d2) {
        var forceLinkDistance = this.props.forceLinkDistance || 90;
        var forceLinkStrength = this.props.forceLinkStrength || 0.7;
        var forceChargeStrength = this.props.forceChargeStrength || -200;
        var collideSize = this.props.collideSize || this.size * 1.5;
        this.ggv.current.d3Force('collide', d3.forceCollide(collideSize));
        this.ggv.current.d3Force('link').distance(forceLinkDistance).strength(forceLinkStrength);
        this.ggv.current.d3Force('charge').strength(forceChargeStrength);
        this.ggv.current.d3Force('radial', d3.forceRadial(this.props.forceRadial ? this.props.forceRadial : 1));
        this.ggv.current.d3Force('center', null);
      }
      if (url) {
        this.addToScene();
      } else if (!this.props.d2) {
        this.zoomCameraToFitScene();
      } else {
        this.forceUpdate();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var dimensions = _reactDom["default"].findDOMNode(this).parentNode.getBoundingClientRect();
      if (dimensions.width !== this.dimensions.width || dimensions.height !== this.dimensions.height) {
        this.dimensions = dimensions;
        if (this.props.d2) {
          this.ggv.current.centerAt(0, 0, this.timeToCenter2DCamera);
        }
        this.forceUpdate();
      }
    }

    /**
     * 
     * @param {*} fnOrString 
     */
  }, {
    key: "fnOrField",
    value: function fnOrField(fnOrString) {
      if (typeof fnOrString === 'string' || fnOrString instanceof String) {
        return function (obj) {
          return obj[fnOrString];
        };
      }
      return fnOrString;
    }

    // add a obj file to the scene from url
  }, {
    key: "addToScene",
    value: function addToScene() {
      var _this2 = this;
      var _this$props2 = this.props,
        url = _this$props2.url,
        _this$props2$wirefram = _this$props2.wireframe,
        wireframe = _this$props2$wirefram === void 0 ? true : _this$props2$wirefram;
      var loader = new _OBJLoader.OBJLoader();
      // load a resource
      loader.load(
      // resource URL
      url,
      // called when resource is loaded
      function (object) {
        if (wireframe) {
          _this2.wireframeAnObject(object);
        }
        _this2.zoomCameraToFitScene(object);
        window.scene.add(object);
      },
      // called when loading is in progresses
      function (xhr) {
        console.log(xhr.loaded / xhr.total * 100 + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened trying to load OBJ file into THREE scene.');
      });
    }
  }, {
    key: "getMaxAndMinVectors",
    value: function getMaxAndMinVectors() {
      var nodes = this.props.data.nodes;
      var maxX = 0,
        maxY = 0,
        maxZ = 0,
        minX = 0,
        minY = 0,
        minZ = 0;
      nodes.forEach(function (_ref) {
        var defaultX = _ref.defaultX,
          defaultY = _ref.defaultY,
          defaultZ = _ref.defaultZ;
        if (defaultX) {
          if (defaultX > maxX) {
            maxX = defaultX;
          } else if (defaultX < minX) {
            minX = defaultX;
          }
        }
        if (defaultY) {
          if (defaultY > maxY) {
            maxY = defaultY;
          } else if (defaultY < minY) {
            minY = defaultY;
          }
        }
        if (defaultZ) {
          if (defaultZ > maxZ) {
            maxZ = defaultZ;
          } else if (defaultZ < minZ) {
            minZ = defaultZ;
          }
        }
      });
      var minVector = new THREE.Vector3(minX, minY, minZ);
      var maxVector = new THREE.Vector3(maxX, maxY, maxZ);
      return [minVector, maxVector, maxX || minY || maxY || minY || maxZ || minZ];
    }

    // cameraSizeRatioToNodeSize controls how big nodes look compared to 
  }, {
    key: "zoomCameraToFitScene",
    value: function zoomCameraToFitScene() {
      var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var cameraSizeRatioToNodeSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
      var offset = this.props.offset ? this.props.offset : 1.25;
      var size = new THREE.Vector3();
      var center = new THREE.Vector3();
      var boundingBox = new THREE.Box3();
      if (object) {
        // if we load a OBJ file, we need to get the size of the boundary box
        boundingBox.setFromObject(object);
      } else {
        // if we maunally set the position of nodes in the graph, we need to adjust the camera in order to see those fixed nodes.
        var _this$getMaxAndMinVec = this.getMaxAndMinVectors(),
          _this$getMaxAndMinVec2 = _slicedToArray(_this$getMaxAndMinVec, 3),
          minV = _this$getMaxAndMinVec2[0],
          maxV = _this$getMaxAndMinVec2[1],
          containsFixedPoints = _this$getMaxAndMinVec2[2];
        if (!containsFixedPoints) {
          this.setState({
            nodeSize: 1
          });
          return;
        }
        boundingBox.set(minV, maxV);
      }
      boundingBox.getCenter(center);
      boundingBox.getSize(size);
      var maxDim = Math.max(size.x, size.y, size.z);
      var fov = this.ggv.current.camera().fov * (Math.PI / 180);
      var cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));
      cameraZ *= offset;
      this.ggv.current.cameraPosition({
        z: cameraZ
      });
      var minZ = boundingBox.min.z;
      var cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;
      this.ggv.current.camera().far = cameraToFarEdge * 3;
      this.ggv.current.camera().updateProjectionMatrix();
      this.ggv.current.camera().lookAt(center);
      this.setState({
        nodeSize: cameraZ / cameraSizeRatioToNodeSize
      });
    }
  }, {
    key: "linkCanvasObject",
    value:
    // Draw this: ( n1 )--- link_Label --->( n2 )
    function linkCanvasObject(link, ctx, globalScale) {
      var color = this.getLinkColor(link);
      ctx.lineWidth = this.getLinkWidth(link);
      var xs = link.source.x;
      var xt = link.target.x;
      var ys = link.source.y;
      var yt = link.target.y;
      var cx = (xs + xt) / 2;
      var cy = (ys + yt) / 2;
      var linkText = this.getLinkLabel(link);
      var arrowSize = this.size * 0.2;
      var linkLength = Math.sqrt((xt - xs) * (xt - xs) + (yt - ys) * (yt - ys));
      var availableSpaceForLinkLabel = linkLength - 2.1 * this.size - 6 * arrowSize;

      // [-PI/2 ; PI/2]
      var angle = Math.atan((yt - ys) / (xt - xs));
      // [-PI ; PI]
      var angle2 = Math.atan2(yt - ys, xt - xs);
      var doNotPlotLinkLabel = !linkText || availableSpaceForLinkLabel < ctx.measureText('Abc...').width;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      if (doNotPlotLinkLabel) {
        linkText = '';
        ctx.beginPath();
        ctx.moveTo(xs, ys);
        ctx.lineTo(xt, yt);
        ctx.stroke();
      } else {
        if (linkText && ctx.measureText(linkText).width > availableSpaceForLinkLabel) {
          var i = linkText.length - 3; // for the ... at the end
          while (ctx.measureText(linkText.substring(0, i) + '...').width > availableSpaceForLinkLabel) {
            i--;
          }
          linkText = linkText.substring(0, i) + '...';
        }
        var textLength = ctx.measureText(linkText).width;
        var subX = Math.cos(angle2) * textLength / 2;
        var subY = Math.sin(angle2) * textLength / 2;

        // Draw line from source node to link label
        ctx.beginPath();
        ctx.moveTo(xs, ys);
        ctx.lineTo(cx - subX, cy - subY);
        ctx.stroke();

        // Draw line from link label to target node
        ctx.beginPath();
        ctx.moveTo(cx + subX, cy + subY);
        ctx.lineTo(xt, yt);
        ctx.stroke();
      }

      // Draw text for link label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      if (linkText) {
        ctx.fillText(linkText, 0, 0);
      }
      var nodeBorderDistance = this.size;
      // Some nodes are bigger than others, find distance from node center to corner and use this as size
      if (link.target.width && link.target.height) {
        nodeBorderDistance = Math.sqrt(link.target.width / 2 * (link.target.width / 2) + link.target.height / 2 * (link.target.height / 2));
      }

      // Draw arrow to indicate link direction
      var dist = linkLength / 2 - nodeBorderDistance - arrowSize;
      ctx.fillStyle = color;
      ctx.beginPath();
      if (angle2 >= Math.PI / 2 || angle2 <= -Math.PI / 2) {
        dist *= -1;
        arrowSize *= -1;
      }
      ctx.moveTo(arrowSize + dist, 0);
      ctx.lineTo(dist, 2.5);
      ctx.lineTo(dist, -2.5);
      ctx.fill();
      ctx.restore();
    }

    /*
     * Draw a node distributing the label in up to 3 lines with '...' in case the third line does not fit
     *    _____
     *   /  A  \
     *  (  node )
     *  ( label )
     *   \_____/
     */
  }, {
    key: "nodeWithName",
    value: function nodeWithName(node, ctx, globalScale) {
      var color = this.getNodeColor(node);
      var labelColor = this.getNodeLabelColor(node);
      ctx.font = this.font;
      var label = this.getNodeLabel(node);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, this.size, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.fillStyle = (0, _utils.getDarkerColor)(color);
      ctx.beginPath();
      ctx.arc(node.x, node.y, this.size - this.borderSize, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = labelColor;
      var maxCharsPerLine = Math.floor(this.size * 1.75 / ctx.measureText("a").width);
      var nodeLabel = (0, _utils.splitter)(label, maxCharsPerLine);

      // Use single, double or triple lines to put text inside node
      if (nodeLabel.length == 1) {
        ctx.fillText(nodeLabel[0], node.x, node.y);
      } else if (nodeLabel.length == 2) {
        ctx.fillText(nodeLabel[0], node.x, node.y - this.doubleGap);
        ctx.fillText(nodeLabel[1], node.x, node.y + this.doubleGap);
      } else if (nodeLabel.length == 3) {
        ctx.fillText(nodeLabel[0], node.x, node.y - this.tripleGap);
        ctx.fillText(nodeLabel[1], node.x, node.y);
        ctx.fillText(nodeLabel[2], node.x, node.y + this.tripleGap);
      } else {
        ctx.fillText(nodeLabel[0], node.x, node.y - this.tripleGap);
        ctx.fillText(nodeLabel[1], node.x, node.y);
        ctx.fillText(nodeLabel[2].slice(0, label.length - 2) + '...', node.x, node.y + this.tripleGap);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$props3 = this.props,
        data = _this$props3.data,
        _this$props3$d = _this$props3.d2,
        d2 = _this$props3$d === void 0 ? false : _this$props3$d,
        _this$props3$xGap = _this$props3.xGap,
        xGap = _this$props3$xGap === void 0 ? 20 : _this$props3$xGap,
        _this$props3$yGap = _this$props3.yGap,
        yGap = _this$props3$yGap === void 0 ? 40 : _this$props3$yGap,
        others = _objectWithoutProperties(_this$props3, _excluded);
      this.addFixedPositionToNodes(data);
      var commonProps = _objectSpread({
        ref: this.ggv,
        graphData: data,
        width: this.dimensions.width - xGap,
        height: this.dimensions.height - yGap,
        onNodeDrag: function onNodeDrag(node) {
          return _this3.onNodeDrag(node);
        }
      }, others);
      if (d2) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          id: this.props.id ? this.props.id : "graph-2d",
          style: this.props.containerStyle ? this.props.containerStyle : null
        }, this.props.controls ? this.props.controls : null, /*#__PURE__*/_react["default"].createElement(_reactForceGraph2d["default"], _extends({
          linkCanvasObjectMode: function linkCanvasObjectMode() {
            return "replace";
          },
          linkCanvasObject: this.linkCanvasObject.bind(this),
          nodeCanvasObject: this.nodeWithName.bind(this),
          nodeRelSize: this.size
        }, commonProps)));
      }
      return /*#__PURE__*/_react["default"].createElement(_reactForceGraph3d["default"], commonProps);
    }
  }]);
}(_react.Component);
GeppettoGraphVisualization.defaultProps = {
  d2: false,
  nodeLabel: function nodeLabel() {},
  linkLabel: function linkLabel() {},
  url: '',
  wireframe: true,
  wireframeColor: '0x6893DE',
  xGap: 20,
  yGap: 45,
  font: '6px Source Sans Pro',
  nodeRelSize: 20,
  forceLinkDistance: 90,
  forceLinkStrength: 0.7,
  forceChargeStrength: -200,
  timeToCenter2DCamera: 0,
  forceRadial: 1
};
GeppettoGraphVisualization.propTypes = {
  /**
   * Object with arrays of nodes and links used to render the graph
   */
  data: _propTypes["default"].shape({
    /**
     * Nodes in the graph
     */
    nodes: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      /**
       * Node identifier
       */
      id: _propTypes["default"].number.isRequired
    })).isRequired,
    /**
    * Links between nodes in the graph
    */
    links: _propTypes["default"].arrayOf(_propTypes["default"].shape({
      /**
       * Source node of the link
       */
      source: _propTypes["default"].number.isRequired,
      /**
       * Target node of the link
       */
      target: _propTypes["default"].number.isRequired
    })).isRequired
  }),
  /**
   * If true, the graph would be 2D.
   * (Default : false)
   */
  d2: _propTypes["default"].bool,
  /**
   * Specify the node label displayed in each node
   */
  nodeLabel: _propTypes["default"].func,
  /**
   * Specify the link label displayed in each node
   */
  linkLabel: _propTypes["default"].func,
  /**
   *  Specify an obj file URL to add to the scene.
   */
  url: _propTypes["default"].string,
  /**
   * Create a wireframe for the object.
   * (Default : true)
   */
  wireframe: _propTypes["default"].bool,
  /**
   * Specify the wireframe color (in hexadecimal).
   * (Default : "0x6893DE")
   */
  wireframeColor: _propTypes["default"].string,
  /**
   * Define width gap size with respect to the parent container.
   * (Default : 20)
   */
  xGap: _propTypes["default"].number,
  /**
   * Define height gap size with respect to the parent container.
   * (Default : 45)
   */
  yGap: _propTypes["default"].number,
  /**
   * Set the default font size and style inside the nodes.
   * (Default : "6px Source Sans Pro")
   */
  font: _propTypes["default"].string,
  /**
   * Adjust the size of the nodes.
   * (Default : 20)
   */
  nodeRelSize: _propTypes["default"].number,
  /**
   * Adjust the length of the spring simulated between two nodes.
   * (Default : 90)
   */
  forceLinkDistance: _propTypes["default"].number,
  /**
   * Adjust the stiffness coefficient for the spring simulated between two nodes
   * (Default : 0.7)
   */
  forceLinkStrength: _propTypes["default"].number,
  /**
   * Adjust the repulsion coefficient simulated between two nodes.
   * (Default : -200)
   */
  forceChargeStrength: _propTypes["default"].number,
  /**
   * Transition time in ms when centering camera in 2D Graph after window resize event. 
   * (Default : 0)
   */
  timeToCenter2DCamera: _propTypes["default"].number,
  /**
   * Creates a radial attractive force of radial circle equal to forceRadial. 
   * Useful to avoid nodes scattering away when they have no links. 
   * (Default : 1)
   */
  forceRadial: _propTypes["default"].number
};
//# sourceMappingURL=Graph.js.map