"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Resources = _interopRequireDefault(require("@metacell/geppetto-meta-core/Resources"));
var _MeshFactory = _interopRequireDefault(require("@metacell/geppetto-meta-ui/3d-canvas/threeDEngine/MeshFactory"));
require("aframe");
require("aframe-slice9-component");
var _LaserControls = _interopRequireDefault(require("../LaserControls"));
require("../aframe/interactable");
require("../aframe/thumbstick-controls");
require("../aframe/rig-wasd-controls");
var _Events = require("../Events");
var _particle = _interopRequireDefault(require("@metacell/geppetto-meta-ui/3d-canvas/textures/particle.png"));
var _util = require("../../3d-canvas/threeDEngine/util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } /* eslint-disable no-template-curly-in-string */
var HOVER_COLOR = {
  r: 0.67,
  g: 0.84,
  b: 0.9
};
var SELECTED_COLOR = {
  r: 1,
  g: 1,
  b: 0
};
var SHORTCUTS = {
  BRING_CLOSER: 99
};
function getProxyInstance(i) {
  var color = i.getId().startsWith('baskets') ? {
    r: 0,
    g: 0,
    b: 1,
    a: 1
  } : {
    r: 1,
    g: 0,
    b: 0,
    a: 1
  };
  return {
    instancePath: i.getId(),
    color: color
  };
}
function updateInstancesMap(geppettoInstance, instancesMap) {
  try {
    if ((0, _util.hasVisualValue)(geppettoInstance)) {
      instancesMap.set(geppettoInstance.getInstancePath(), getProxyInstance(geppettoInstance));
    } else if ((0, _util.hasVisualType)(geppettoInstance)) {
      if (geppettoInstance.getType().getMetaType() !== _Resources["default"].ARRAY_TYPE_NODE && geppettoInstance.getVisualType()) {
        instancesMap.set(geppettoInstance.getInstancePath(), getProxyInstance(geppettoInstance));
      }
      if (geppettoInstance.getMetaType() === _Resources["default"].INSTANCE_NODE) {
        var children = geppettoInstance.getChildren();
        for (var i = 0; i < children.length; i++) {
          updateInstancesMap(children[i], instancesMap);
        }
      } else if (geppettoInstance.getMetaType() === _Resources["default"].ARRAY_INSTANCE_NODE) {
        for (var _i = 0; _i < geppettoInstance.length; _i++) {
          updateInstancesMap(geppettoInstance[_i], instancesMap);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
function getInstancesMap(instances) {
  var instancesMap = new Map();
  var _iterator = _createForOfIteratorHelper(instances),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var instance = _step.value;
      updateInstancesMap(instance, instancesMap);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return instancesMap;
}
var Canvas = /*#__PURE__*/function (_Component) {
  function Canvas(props) {
    var _this;
    _classCallCheck(this, Canvas);
    _this = _callSuper(this, Canvas, [props]);
    _this.state = {
      loadedTextures: false,
      time: 0,
      isReady: false
    };
    _this.canvasRef = /*#__PURE__*/_react["default"].createRef();
    _this.sceneRef = /*#__PURE__*/_react["default"].createRef();
    _this.handleLoadedTextures = _this.handleLoadedTextures.bind(_this);
    _this.handleHover = _this.handleHover.bind(_this);
    _this.handleHoverLeave = _this.handleHoverLeave.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleKeyboardPress = _this.handleKeyboardPress.bind(_this);
    _this.threeMeshes = {};
    _this.selectedMeshes = {};
    _this.hoveredMeshes = {};
    _this.initTextures(_this.handleLoadedTextures);
    return _this;
  }
  _inherits(Canvas, _Component);
  return _createClass(Canvas, [{
    key: "initTextures",
    value: function initTextures(callback) {
      var _this2 = this;
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load(_particle["default"], function (texture) {
        _this2.particleTexture = texture;
        callback();
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
        id = _this$props.id,
        threshold = _this$props.threshold;
      var scene = document.getElementById("".concat(id, "_scene"));
      this.meshFactory = new _MeshFactory["default"](scene.object3D, threshold, true, 300, 1, null, THREE);
      this.sceneRef.current.addEventListener('mesh_hover', this.handleHover);
      this.sceneRef.current.addEventListener('mesh_hover_leave', this.handleHoverLeave);
      this.sceneRef.current.addEventListener('mesh_click', this.handleClick);
      document.addEventListener('keypress', this.handleKeyboardPress);
      this.setEntityMeshes();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var instances = this.props.instances;
      if (instances !== nextProps.instances) {
        this.meshFactory.start(getInstancesMap(nextProps.instances));
      }
      return true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this3 = this;
      var instances = this.props.instances;
      var _this$state = this.state,
        loadedTextures = _this$state.loadedTextures,
        isReady = _this$state.isReady;
      if (!isReady) {
        if (loadedTextures) {
          this.meshFactory.setParticleTexture(this.particleTexture);
          this.meshFactory.start(getInstancesMap(instances)).then(function (_) {
            _this3.threeMeshes = _this3.meshFactory.getMeshes();
            _this3.setState({
              isReady: true
            });
          });
        }
      }
      this.setEntityMeshes();
    }
  }, {
    key: "setEntityMeshes",
    value: function setEntityMeshes() {
      var _this4 = this;
      var canvasEntity = this.canvasRef.current;
      var sceneMeshes = [];
      var keysThreeMeshes = Object.keys(this.threeMeshes).filter(function (key) {
        return _this4.threeMeshes[key].visible;
      });
      for (var _i2 = 0; _i2 < canvasEntity.children.length; _i2++) {
        var element = canvasEntity.children[_i2];
        if (element.id.startsWith('a-entity')) {
          sceneMeshes.push(element);
        }
      }
      if (sceneMeshes.length !== keysThreeMeshes.length) {
        throw new Error('Meshes do not match. Possible illegal use of a-entity as id.');
      }
      var i = 0;
      var _iterator2 = _createForOfIteratorHelper(keysThreeMeshes),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var meshKey = _step2.value;
          var entity = sceneMeshes[i];
          var mesh = this.threeMeshes[meshKey];
          entity.setObject3D('mesh', mesh);
          i++;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "handleLoadedTextures",
    value: function handleLoadedTextures() {
      this.setState({
        loadedTextures: true
      });
    }
  }, {
    key: "handleHover",
    value: function handleHover(evt) {
      var handleHover = this.props.handleHover;
      if (Object.keys(this.hoveredMeshes).includes(evt.detail.id)) {
        return;
      }
      if (evt.detail.getObject3D('mesh') !== undefined && evt.detail.getObject3D('mesh').material) {
        this.hoveredMeshes[evt.detail.id] = _objectSpread({}, evt.detail.getObject3D('mesh').material.color);
        evt.detail.getObject3D('mesh').material.color.setRGB(HOVER_COLOR.r, HOVER_COLOR.g, HOVER_COLOR.b);
        handleHover(evt, false);
      }
    }
  }, {
    key: "handleHoverLeave",
    value: function handleHoverLeave(evt) {
      var handleHoverLeave = this.props.handleHoverLeave;
      if (Object.keys(this.hoveredMeshes).includes(evt.detail.id)) {
        var color = this.hoveredMeshes[evt.detail.id];
        evt.detail.getObject3D('mesh').material.color.setRGB(color.r, color.g, color.b);
        delete this.hoveredMeshes[evt.detail.id];
      }
      handleHoverLeave(evt, false);
    }
  }, {
    key: "handleKeyboardPress",
    value: function handleKeyboardPress(evt) {
      // eslint-disable-next-line eqeqeq
      if (evt.keyCode === SHORTCUTS.COLLAPSE_MENU) {
        var isMenuVisible = this.state.isMenuVisible;
        this.setState({
          isMenuVisible: !isMenuVisible
        });
      } else if (evt.keyCode === SHORTCUTS.BRING_CLOSER) {
        var toModel = true;
        var cEvent = new CustomEvent(_Events.BRING_CLOSER, {
          detail: null
        });
        // TODO: Only works for 1 selected object atm
        if (Object.keys(this.selectedMeshes).length === 1) {
          for (var _i3 = 0, _Object$keys = Object.keys(this.selectedMeshes); _i3 < _Object$keys.length; _i3++) {
            var selected = _Object$keys[_i3];
            var el = document.getElementById(selected);
            el.dispatchEvent(cEvent);
            toModel = false;
          }
          if (toModel) {
            var id = this.props.id;
            var modelID = "".concat(id, "_model");
            var model = document.getElementById(modelID);
            model.dispatchEvent(cEvent);
          }
        }
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(evt) {
      var handleClick = this.props.handleClick;
      var preventDefault = handleClick(evt);
      if (!preventDefault && evt.detail.getObject3D('mesh') !== undefined) {
        if (Object.keys(this.selectedMeshes).includes(evt.detail.id)) {
          // eslint-disable-next-line no-param-reassign
          evt.detail.selected = false;
          var color = this.selectedMeshes[evt.detail.id];
          if (color.r != undefined & color.g != undefined & color.b != undefined) {
            evt.detail.getObject3D('mesh').material.color.setRGB(color.r, color.g, color.b);
          } else {
            evt.detail.getObject3D('mesh').material.color.set(color);
          }
          delete this.selectedMeshes[evt.detail.id];
          this.hoveredMeshes = _objectSpread({}, evt.detail.getObject3D('mesh').material.color);
        } else {
          // eslint-disable-next-line no-param-reassign
          evt.detail.selected = true;
          var meshCopy = evt.detail.getObject3D('mesh').material.defaultColor;
          this.selectedMeshes[evt.detail.id] = meshCopy;
          evt.detail.getObject3D('mesh').material.color.setRGB(SELECTED_COLOR.r, SELECTED_COLOR.g, SELECTED_COLOR.b);
          this.hoveredMeshes = _objectSpread({}, evt.detail.getObject3D('mesh').material.color);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;
      var _this$props2 = this.props,
        sceneBackground = _this$props2.sceneBackground,
        id = _this$props2.id,
        position = _this$props2.position,
        rotation = _this$props2.rotation,
        embedded = _this$props2.embedded;
      var sceneID = "".concat(id, "_scene");
      var cameraID = "".concat(id, "_camera");
      var modelID = "".concat(id, "_model");
      return /*#__PURE__*/_react["default"].createElement("a-scene", {
        id: sceneID,
        ref: this.sceneRef,
        background: sceneBackground,
        "loading-screen": "dotsColor: orange; backgroundColor: black",
        "class": "scene",
        shadow: "enabled: false; autoUpdate: false",
        light: "defaultLightsEnabled: false",
        embedded: embedded
      }, /*#__PURE__*/_react["default"].createElement("a-assets", null, /*#__PURE__*/_react["default"].createElement("img", {
        id: "sliceImg",
        alt: "slice_image",
        src: "https://cdn.glitch.com/0ddef241-2c1a-4bc2-8d47-58192c718908%2Fslice.png?1557308835598",
        crossOrigin: "true"
      }), /*#__PURE__*/_react["default"].createElement("a-mixin", {
        id: "buttonBackground",
        mixin: "slice",
        slice9: "width: 1.3; height: 0.3; color: #030303"
      }), /*#__PURE__*/_react["default"].createElement("a-mixin", {
        id: "buttonText",
        mixin: "font",
        text: "align: center; width: 2.5; zOffset: 0.01; color: #333"
      }), /*#__PURE__*/_react["default"].createElement("a-mixin", {
        id: "button",
        mixin: "buttonBackground buttonText",
        "class": "collidable"
      }), /*#__PURE__*/_react["default"].createElement("a-mixin", {
        id: "slice",
        slice9: "color: #050505; transparent: true; opacity: 0.9; src: #sliceImg; left: 50; right: 52; top: 50; bottom: 52; padding: 0.15"
      })), /*#__PURE__*/_react["default"].createElement("a-entity", {
        id: cameraID,
        position: "0 5 0",
        "thumbstick-controls": "id: ".concat(id, "; acceleration:200"),
        "rig-wasd-controls": "fly:true; acceleration:200"
      }, /*#__PURE__*/_react["default"].createElement("a-camera", {
        cursor: "rayOrigin: mouse",
        "wasd-controls": "enabled:false"
      }), /*#__PURE__*/_react["default"].createElement(_LaserControls["default"], {
        id: id
      })), /*#__PURE__*/_react["default"].createElement("a-plane", {
        position: "0 0 -4",
        rotation: "-90 0 0",
        width: "100",
        height: "100",
        color: "#7BC8A4"
      }), /*#__PURE__*/_react["default"].createElement("a-entity", {
        ref: this.canvasRef,
        position: position,
        rotation: rotation,
        scale: "0.1, 0.1 0.1",
        id: modelID,
        interactable: "id: ".concat(id)
      }, Object.keys(this.threeMeshes).filter(function (key) {
        return _this5.threeMeshes[key].visible;
      }).map(function (key) {
        return /*#__PURE__*/_react["default"].createElement("a-entity", {
          "class": "collidable",
          key: "a-entity".concat(key, "_").concat(id),
          id: "a-entity".concat(key, "_").concat(id),
          interactable: "id: ".concat(id)
        });
      })));
    }
  }]);
}(_react.Component);
Canvas.defaultProps = {
  threshold: 1000,
  colorMap: {},
  position: '-20 -20 -80',
  rotation: '0 0 0',
  sceneBackground: 'color: #ECECEC',
  handleHover: function handleHover() {
    return false;
  },
  handleClick: function handleClick() {
    return false;
  },
  handleHoverLeave: function handleHoverLeave() {},
  handleModelChange: function handleModelChange() {}
};
Canvas.propTypes = {
  /**
   * Instances
   */
  instances: _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
  /**
   * Model used in canvas
   */
  model: _propTypes["default"].object.isRequired,
  /**
   * Id of this canvas
   */
  id: _propTypes["default"].string.isRequired,
  /**
   * Threshold
   */
  threshold: _propTypes["default"].number,
  /**
   *  Color map
   */
  colorMap: _propTypes["default"].object,
  /**
   * Three values to describe position along x, y, and z axis. Format example => "-20 -20 -80"
   */
  position: _propTypes["default"].string,
  /**
   * Three values to describe rotation. Format example => "0 0 0"
   */
  rotation: _propTypes["default"].string,
  /**
   * Color applied to the scene's background. Format example => "color: #ECECEC"
   */
  sceneBackground: _propTypes["default"].string,
  /**
   * Function to callback on hover
   */
  handleHover: _propTypes["default"].func,
  /**
   * Function to callback on click
   */
  handleClick: _propTypes["default"].func,
  /**
   * Function to callback on hover leave
   */
  handleHoverLeave: _propTypes["default"].func,
  /**
   * Function to callback when model changes
   */
  handleModelChange: _propTypes["default"].func
};
var _default = exports["default"] = Canvas;
//# sourceMappingURL=Canvas.js.map