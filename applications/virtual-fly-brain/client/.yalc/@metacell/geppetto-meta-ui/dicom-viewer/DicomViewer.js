"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@material-ui/core");
var _propTypes = _interopRequireDefault(require("prop-types"));
var THREE = _interopRequireWildcard(require("three"));
var _DicomViewerUtils = _interopRequireDefault(require("./DicomViewerUtils"));
var _utilities = require("../utilities");
var _ami = require("ami.js");
var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");
var _CustomToolbar = _interopRequireDefault(require("../common/CustomToolbar"));
var _util = require("./util");
var _Loader = _interopRequireDefault(require("../loader/Loader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
var HelpersBoundingBox = (0, _ami.boundingBoxHelperFactory)(THREE);
var styles = {
  dicomViewer: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#353535'
  },
  renderer: {
    backgroundColor: '#000',
    "float": 'left',
    width: '50%',
    height: '50%'
  },
  toolbar: {
    padding: '0',
    marginLeft: '5px'
  },
  toolbarBox: {
    backgroundColor: 'rgb(0,0,0,0.5);'
  },
  button: {
    padding: '8px',
    top: '0',
    color: '#fc6320'
  }
};
var DicomViewer = /*#__PURE__*/function (_Component) {
  function DicomViewer(props) {
    var _this2;
    _classCallCheck(this, DicomViewer);
    _this2 = _callSuper(this, DicomViewer, [props]);
    _this2.state = {
      files: _this2.extractFilesPath(_this2.props.data),
      mode: _this2.props.mode === undefined ? 'quad_view' : _this2.props.mode,
      orientation: _this2.props.orientation === undefined ? 'coronal' : _this2.props.orientation,
      fullScreen: false,
      ready: false
    };

    // 3d renderer
    _this2.r0 = {
      domClass: 'r0',
      domElement: null,
      renderer: null,
      color: 0x212121,
      targetID: 0,
      camera: null,
      controls: null,
      scene: null,
      light: null
    };

    // 2d axial renderer
    _this2.r1 = {
      domClass: 'r1',
      domElement: null,
      renderer: null,
      color: 0x121212,
      sliceOrientation: 'axial',
      sliceColor: 0xff1744,
      targetID: 1,
      camera: null,
      controls: null,
      scene: null,
      light: null,
      stackHelper: null,
      localizerHelper: null,
      localizerScene: null
    };

    // 2d sagittal renderer
    _this2.r2 = {
      domClass: 'r2',
      domElement: null,
      renderer: null,
      color: 0x121212,
      sliceOrientation: 'sagittal',
      sliceColor: 0xffea00,
      targetID: 2,
      camera: null,
      controls: null,
      scene: null,
      light: null,
      stackHelper: null,
      localizerHelper: null,
      localizerScene: null
    };

    // 2d coronal renderer
    _this2.r3 = {
      domClass: 'r3',
      domElement: null,
      renderer: null,
      color: 0x121212,
      sliceOrientation: 'coronal',
      sliceColor: 0x76ff03,
      targetID: 3,
      camera: null,
      controls: null,
      scene: null,
      light: null,
      stackHelper: null,
      localizerHelper: null,
      localizerScene: null
    };
    _this2.changeMode = _this2.changeMode.bind(_this2);
    _this2.changeOrientation = _this2.changeOrientation.bind(_this2);
    _this2.download = _this2.download.bind(_this2);
    _this2.restore = _this2.restore.bind(_this2);
    _this2.fullScreen = _this2.fullScreen.bind(_this2);
    _this2.containerRef = /*#__PURE__*/_react["default"].createRef();
    return _this2;
  }
  _inherits(DicomViewer, _Component);
  return _createClass(DicomViewer, [{
    key: "extractFilesPath",
    value: function extractFilesPath(data) {
      var files;
      if (data !== undefined) {
        if (data.getMetaType === undefined) {
          files = data;
        } else if (data.getMetaType() === 'Instance') {
          if (data.getVariable().getInitialValues()[0].value.format === 'NIFTI') {
            files = data.getVariable().getInitialValues()[0].value.data;
          } else if (data.getVariable().getInitialValues()[0].value.format === 'DCM') {
            // todo: What do we do here?
          }
        }
      }
      return files;
    }
  }, {
    key: "loadModel",
    value: function loadModel() {
      if (this.state.files !== undefined && null != this.state.files) {
        /**
         * Init the quadview
         */
        var init = function init() {
          /**
           * Called on each animation frame
           */
          function animate() {
            // we are ready when both meshes have been loaded
            if (_this.ready) {
              if (_this.state.mode === 'single_view' && _this.state.orientation === '3d' || _this.state.mode === 'quad_view') {
                // render
                _this.r0.controls.update();
                _this.r0.light.position.copy(_this.r0.camera.position);
                _this.r0.renderer.render(_this.r0.scene, _this.r0.camera);
              }
              if (_this.state.mode === 'single_view' && _this.state.orientation === 'sagittal' || _this.state.mode === 'quad_view') {
                _this.r1.controls.update();
                // r1
                _this.r1.renderer.clear();
                _this.r1.renderer.render(_this.r1.scene, _this.r1.camera);

                // localizer
                _this.r1.renderer.clearDepth();
                _this.r1.renderer.render(_this.r1.localizerScene, _this.r1.camera);
              }
              if (_this.state.mode === 'single_view' && _this.state.orientation === 'axial' || _this.state.mode === 'quad_view') {
                _this.r2.controls.update();
                // r2
                _this.r2.renderer.clear();
                _this.r2.renderer.render(_this.r2.scene, _this.r2.camera);
                // localizer
                _this.r2.renderer.clearDepth();
                _this.r2.renderer.render(_this.r2.localizerScene, _this.r2.camera);
              }
              if (_this.state.mode === 'single_view' && _this.state.orientation === 'coronal' || _this.state.mode === 'quad_view') {
                _this.r3.controls.update();
                // r3
                _this.r3.renderer.clear();
                _this.r3.renderer.render(_this.r3.scene, _this.r3.camera);
                // localizer
                _this.r3.renderer.clearDepth();
                _this.r3.renderer.render(_this.r3.localizerScene, _this.r3.camera);
              }
            }

            // request new frame
            requestAnimationFrame(function () {
              animate();
            });
          }

          // renderers
          _DicomViewerUtils["default"].initRenderer3D(_this.r0, _this.containerRef.current);
          _DicomViewerUtils["default"].initRenderer2D(_this.r1, _this.containerRef.current);
          _DicomViewerUtils["default"].initRenderer2D(_this.r2, _this.containerRef.current);
          _DicomViewerUtils["default"].initRenderer2D(_this.r3, _this.containerRef.current);

          // start rendering loop
          animate();
        }; // init threeJS
        this.ready = false;
        var _this = this;
        init();

        /*
         * load sequence for each file
         * instantiate the loader
         * it loads and parses the dicom image
         */
        var loader = new _ami.VolumeLoader();
        loader.load(this.state.files).then(function () {
          var series = loader.data[0].mergeSeries(loader.data)[0];
          loader.free();
          loader = null;
          // get first stack from series
          var stack = series.stack[0];
          stack.prepare();

          // center 3d camera/control on the stack
          var centerLPS = stack.worldCenter();
          _this.r0.camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
          _this.r0.camera.updateProjectionMatrix();
          _this.r0.controls.target.set(centerLPS.x, centerLPS.y, centerLPS.z);

          // bouding box
          var boxHelper = new HelpersBoundingBox(stack);
          _this.r0.scene.add(boxHelper);

          // red slice
          _DicomViewerUtils["default"].initHelpersStack(_this.r1, stack);
          _this.r0.scene.add(_this.r1.scene);

          // yellow slice
          _DicomViewerUtils["default"].initHelpersStack(_this.r2, stack);
          _this.r0.scene.add(_this.r2.scene);

          // green slice
          _DicomViewerUtils["default"].initHelpersStack(_this.r3, stack);
          _this.r0.scene.add(_this.r3.scene);

          // create new mesh with Localizer shaders
          var plane1 = _this.r1.stackHelper.slice.cartesianEquation();
          var plane2 = _this.r2.stackHelper.slice.cartesianEquation();
          var plane3 = _this.r3.stackHelper.slice.cartesianEquation();

          // localizer red slice
          _DicomViewerUtils["default"].initHelpersLocalizer(_this.r1, stack, plane1, [{
            plane: plane2,
            color: new THREE.Color(_this.r2.stackHelper.borderColor)
          }, {
            plane: plane3,
            color: new THREE.Color(_this.r3.stackHelper.borderColor)
          }]);

          // localizer yellow slice
          _DicomViewerUtils["default"].initHelpersLocalizer(_this.r2, stack, plane2, [{
            plane: plane1,
            color: new THREE.Color(_this.r1.stackHelper.borderColor)
          }, {
            plane: plane3,
            color: new THREE.Color(_this.r3.stackHelper.borderColor)
          }]);

          // localizer green slice
          _DicomViewerUtils["default"].initHelpersLocalizer(_this.r3, stack, plane3, [{
            plane: plane1,
            color: new THREE.Color(_this.r1.stackHelper.borderColor)
          }, {
            plane: plane2,
            color: new THREE.Color(_this.r2.stackHelper.borderColor)
          }]);
          _this.configureEvents();
          _this.ready = true;
          _this.props.onLoaded(_this.r0.scene);
          _this.setState({
            ready: true
          });
        })["catch"](function (error) {
          window.console.log('oops... something went wrong...');
          window.console.log(error);
        });
      }
    }
  }, {
    key: "configureEvents",
    value: function configureEvents() {
      var _this = this;
      function goToPoint(event) {
        var canvas = event.srcElement.parentElement;
        var id = event.target.id;
        var mouse = {
          x: (event.clientX - (0, _utilities.offset)(canvas).left) / canvas.clientWidth * 2 - 1,
          y: -((event.clientY - (0, _utilities.offset)(canvas).top) / canvas.clientHeight) * 2 + 1
        };
        var camera = null;
        var stackHelper = null;
        var scene = null;
        switch (id) {
          case '0':
            camera = _this.r0.camera;
            stackHelper = _this.r1.stackHelper;
            scene = _this.r0.scene;
            break;
          case '1':
            camera = _this.r1.camera;
            stackHelper = _this.r1.stackHelper;
            scene = _this.r1.scene;
            break;
          case '2':
            camera = _this.r2.camera;
            stackHelper = _this.r2.stackHelper;
            scene = _this.r2.scene;
            break;
          case '3':
            camera = _this.r3.camera;
            stackHelper = _this.r3.stackHelper;
            scene = _this.r3.scene;
            break;
        }
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
          var ijk = _ami.StackModel.worldToData(stackHelper.stack, intersects[0].point);
          _this.r1.stackHelper.index = ijk.getComponent((_this.r1.stackHelper.orientation + 2) % 3);
          _this.r2.stackHelper.index = ijk.getComponent((_this.r2.stackHelper.orientation + 2) % 3);
          _this.r3.stackHelper.index = ijk.getComponent((_this.r3.stackHelper.orientation + 2) % 3);
          _DicomViewerUtils["default"].updateLocalizer(_this.r2, [_this.r1.localizerHelper, _this.r3.localizerHelper]);
          _DicomViewerUtils["default"].updateLocalizer(_this.r1, [_this.r2.localizerHelper, _this.r3.localizerHelper]);
          _DicomViewerUtils["default"].updateLocalizer(_this.r3, [_this.r1.localizerHelper, _this.r2.localizerHelper]);
        }
      }
      function goToSingleView(event) {
        var id = event.target.id;
        var orientation = null;
        switch (id) {
          case '0':
            orientation = '3d';
            break;
          case '1':
            orientation = 'sagittal';
            break;
          case '2':
            orientation = 'axial';
            break;
          case '3':
            orientation = 'coronal';
            break;
        }
        if (orientation != null) {
          _this.setState({
            mode: 'single_view',
            orientation: orientation
          });
        }
      }
      function toggleMode(event) {
        if (_this.state.mode === 'single_view') {
          _this.changeMode();
        } else {
          goToSingleView(event);
        }
      }
      function onScroll(event) {
        var id = event.target.domElement.id;
        var stackHelper = null;
        switch (id) {
          case 'r1':
            stackHelper = _this.r1.stackHelper;
            break;
          case 'r2':
            stackHelper = _this.r2.stackHelper;
            break;
          case 'r3':
            stackHelper = _this.r3.stackHelper;
            break;
        }
        if (event.delta > 0) {
          if (stackHelper.index >= stackHelper.orientationMaxIndex - 1) {
            return false;
          }
          stackHelper.index += 1;
        } else {
          if (stackHelper.index <= 0) {
            return false;
          }
          stackHelper.index -= 1;
        }
        _DicomViewerUtils["default"].updateLocalizer(_this.r2, [_this.r1.localizerHelper, _this.r3.localizerHelper]);
        _DicomViewerUtils["default"].updateLocalizer(_this.r1, [_this.r2.localizerHelper, _this.r3.localizerHelper]);
        _DicomViewerUtils["default"].updateLocalizer(_this.r3, [_this.r1.localizerHelper, _this.r2.localizerHelper]);
      }
      function performEventAction(action, event) {
        // Check if it is a already defined action or a external one
        if (action === 'goToPoint' || action === 'goToSingleView' || action === 'toggleMode') {
          eval(action + '(event)');
        } else {
          action(event, this);
        }
      }
      function eventHandling(event) {
        if (event.type === 'click' && _this.props.onClick !== undefined) {
          performEventAction(_this.props.onClick, event);
        } else if (event.type === 'click' && (event.ctrlKey || event.metaKey) && _this.props.onCtrlClick !== undefined) {
          performEventAction(_this.props.onCtrlClick, event);
        } else if (event.type === 'click' && event.shiftKey && _this.props.onShiftClick !== undefined) {
          performEventAction(_this.props.onShiftClick, event);
        } else if (event.type === 'dblclick' && _this.props.onDoubleClick !== undefined) {
          performEventAction(_this.props.onDoubleClick, event);
        }
      }

      // event listeners ondoubleclick
      _this.r0.domElement.addEventListener('dblclick', eventHandling);
      _this.r1.domElement.addEventListener('dblclick', eventHandling);
      _this.r2.domElement.addEventListener('dblclick', eventHandling);
      _this.r3.domElement.addEventListener('dblclick', eventHandling);

      // event listeners onclick
      this.r0.domElement.addEventListener('click', eventHandling);
      this.r1.domElement.addEventListener('click', eventHandling);
      this.r2.domElement.addEventListener('click', eventHandling);
      this.r3.domElement.addEventListener('click', eventHandling);

      // event listeners on scrol
      this.r1.controls.addEventListener('OnScroll', onScroll);
      this.r2.controls.addEventListener('OnScroll', onScroll);
      this.r3.controls.addEventListener('OnScroll', onScroll);
    }
  }, {
    key: "setQuadLayout",
    value: function setQuadLayout() {
      // update 3D
      _DicomViewerUtils["default"].windowResize3D(this.r0);

      // update 2d
      _DicomViewerUtils["default"].windowResize2D(this.r1);
      _DicomViewerUtils["default"].windowResize2D(this.r2);
      _DicomViewerUtils["default"].windowResize2D(this.r3);
    }
  }, {
    key: "setSingleLayout",
    value: function setSingleLayout() {
      var rendererObj;
      switch (this.state.orientation) {
        case '3d':
          rendererObj = this.r0;
          break;
        case 'sagittal':
          rendererObj = this.r1;
          break;
        case 'axial':
          rendererObj = this.r2;
          break;
        case 'coronal':
          rendererObj = this.r3;
          break;
      }
      if (this.state.orientation === '3d') {
        _DicomViewerUtils["default"].windowResize3D(rendererObj);
      } else {
        _DicomViewerUtils["default"].windowResize2D(rendererObj);
      }
    }
  }, {
    key: "setLayout",
    value: function setLayout() {
      if (this.state.mode === 'single_view') {
        this.setSingleLayout();
      } else {
        this.setQuadLayout();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _DicomViewerUtils["default"].dispose(this.r0);
      _DicomViewerUtils["default"].dispose(this.r1);
      _DicomViewerUtils["default"].dispose(this.r2);
      _DicomViewerUtils["default"].dispose(this.r3);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadModel();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevState.files !== this.state.files) {
        this.loadModel();
      } else {
        this.setLayout();
      }
    }
  }, {
    key: "changeMode",
    value: function changeMode() {
      if (this.state.mode === 'single_view') {
        this.setState({
          mode: 'quad_view'
        });
      } else {
        this.setState({
          mode: 'single_view'
        });
      }
    }
  }, {
    key: "changeOrientation",
    value: function changeOrientation() {
      var newOrientation;
      switch (this.state.orientation) {
        case 'coronal':
          newOrientation = 'sagittal';
          break;
        case 'sagittal':
          newOrientation = 'axial';
          break;
        case 'axial':
          newOrientation = '3d';
          break;
        case '3d':
          newOrientation = 'coronal';
          break;
        default:
          break;
      }
      this.setState({
        orientation: newOrientation
      });
    }
  }, {
    key: "download",
    value: function download() {
      (0, _util.createZipFromRemoteFiles)(this.state.files, 'data.zip');
    }
  }, {
    key: "restore",
    value: function restore() {
      this.setState({
        fullScreen: false
      });
    }
  }, {
    key: "fullScreen",
    value: function fullScreen() {
      this.setState({
        fullScreen: true
      });
    }
  }, {
    key: "getCustomButtons",
    value: function getCustomButtons() {
      var customButtons = [];
      if (this.state.mode === 'single_view') {
        customButtons.push({
          icon: _freeSolidSvgIcons.faThLarge,
          id: 'Multi View',
          tooltip: 'Multi View',
          action: this.changeMode
        });
        customButtons.push({
          icon: _freeSolidSvgIcons.faExchangeAlt,
          id: 'Change Orientation',
          tooltip: 'Change Orientation',
          action: this.changeOrientation
        });
      } else {
        customButtons.push({
          icon: _freeSolidSvgIcons.faSquare,
          id: 'Single View',
          tooltip: 'Single View',
          action: this.changeMode
        });
      }
      if (this.props.showDownloadButton) {
        customButtons.push({
          icon: _freeSolidSvgIcons.faDownload,
          id: 'Download',
          tooltip: 'Download',
          action: this.download
        });
      }
      if (this.state.fullScreen) {
        customButtons.push({
          icon: _freeSolidSvgIcons.faCompressAlt,
          id: 'Restore',
          tooltip: 'Restore',
          action: this.restore
        });
      } else {
        customButtons.push({
          icon: _freeSolidSvgIcons.faExpandAlt,
          id: 'Maximize',
          tooltip: 'Maximize',
          action: this.fullScreen
        });
      }
      return customButtons;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        classes = _this$props.classes,
        toolbarOptions = _this$props.toolbarOptions,
        loaderOptions = _this$props.loaderOptions;
      var fullScreen = this.state.fullScreen;
      var customButtons = this.getCustomButtons();
      var containerStyle = fullScreen ? {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9999',
        background: '#121212',
        height: '100%',
        width: '100%'
      } : {
        height: '100%',
        width: '100%'
      };
      var showLoader = loaderOptions && loaderOptions.showLoader;
      var loader = loaderOptions && loaderOptions.instance ? /*#__PURE__*/_react["default"].createElement(loaderOptions.instance, loaderOptions.props) : /*#__PURE__*/_react["default"].createElement(_Loader["default"], {
        fullscreen: this.state.fullScreen,
        handleClose: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.handleClose,
        messages: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.messages,
        messagesInterval: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.messagesInterval,
        elapsed: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.elapsed,
        backgroundStyle: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.backgroundStyle
      });
      var toolbar = toolbarOptions && toolbarOptions.instance ? /*#__PURE__*/_react["default"].createElement(toolbarOptions.instance, _extends({
        buttons: customButtons
      }, toolbarOptions.props)) : /*#__PURE__*/_react["default"].createElement(_CustomToolbar["default"], {
        buttons: customButtons,
        containerStyles: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.containerStyles,
        toolBarClassName: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.toolBarClassName,
        innerDivStyles: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.innerDivStyles,
        buttonStyles: toolbarOptions === null || toolbarOptions === void 0 ? void 0 : toolbarOptions.buttonStyles
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.containerRef,
        key: this.props.id + '_component',
        id: this.props.id + '_component',
        style: containerStyle
      }, !this.state.ready && showLoader && loader, toolbar, /*#__PURE__*/_react["default"].createElement("div", {
        className: classes.dicomViewer,
        style: {
          height: '90%',
          width: '100%'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "r0",
        className: classes.renderer + ' r0',
        style: {
          display: this.state.mode === 'single_view' && this.state.orientation !== '3d' ? 'none' : '',
          width: this.state.mode === 'single_view' && this.state.orientation === '3d' ? '100%' : '50%',
          height: this.state.mode === 'single_view' && this.state.orientation === '3d' ? '100%' : '50%'
        }
      }), /*#__PURE__*/_react["default"].createElement("div", {
        id: "r1",
        className: classes.renderer + ' r1',
        style: {
          display: this.state.mode === 'single_view' && this.state.orientation !== 'sagittal' ? 'none' : '',
          width: this.state.mode === 'single_view' && this.state.orientation === 'sagittal' ? '100%' : '50%',
          height: this.state.mode === 'single_view' && this.state.orientation === 'sagittal' ? '100%' : '50%'
        }
      }), /*#__PURE__*/_react["default"].createElement("div", {
        id: "r2",
        className: classes.renderer + ' r2',
        style: {
          display: this.state.mode === 'single_view' && this.state.orientation !== 'axial' ? 'none' : '',
          width: this.state.mode === 'single_view' && this.state.orientation === 'axial' ? '100%' : '50%',
          height: this.state.mode === 'single_view' && this.state.orientation === 'axial' ? '100%' : '50%'
        }
      }), /*#__PURE__*/_react["default"].createElement("div", {
        id: "r3",
        className: classes.renderer + ' r3',
        style: {
          display: this.state.mode === 'single_view' && this.state.orientation !== 'coronal' ? 'none' : '',
          width: this.state.mode === 'single_view' && this.state.orientation === 'coronal' ? '100%' : '50%',
          height: this.state.mode === 'single_view' && this.state.orientation === 'coronal' ? '100%' : '50%'
        }
      })));
    }
  }]);
}(_react.Component);
DicomViewer.defaultProps = {
  onLoaded: function onLoaded() {},
  mode: 'coronal',
  orientation: 'goToPoint',
  onClick: 'goToPoint',
  onCtrlClick: 'goToPoint',
  onShiftClick: 'goToPoint',
  onDoubleClick: 'goToPoint',
  showDownloadButton: false,
  toolbarOptions: null,
  loaderOptions: {
    showLoader: true
  }
};
DicomViewer.propTypes = {
  /**
   * Component identifier
   */
  id: _propTypes["default"].string.isRequired,
  /**
   * Path/URL to file (f.e. "/path/to/my/file.gz")
   */
  data: _propTypes["default"].string.isRequired,
  /**
   * Initial view mode: 'single_view' or 'quad_view'
   */
  mode: _propTypes["default"].string,
  /**
   * Initial orientation view: 'coronal', 'axial' or 'sagittal'
   */
  orientation: _propTypes["default"].string,
  /**
   * Action to perform on click: 'goToPoint', 'goToSingleView', 'toggleMode', or other
   */
  onClick: _propTypes["default"].oneOfType([_propTypes["default"].oneOf(['goToPoint', 'goToSingleView', 'toggleMode']), _propTypes["default"].func]),
  /**
   * Action to performe on Ctrl click: 'goToPoint', 'goToSingleView', 'toggleMode', or other
   */
  onCtrlClick: _propTypes["default"].oneOfType([_propTypes["default"].oneOf(['goToPoint', 'goToSingleView', 'toggleMode']), _propTypes["default"].func]),
  /**
   * Action to performe on Shift click: 'goToPoint', 'goToSingleView', 'toggleMode', or other
   */
  onShiftClick: _propTypes["default"].oneOfType([_propTypes["default"].oneOf(['goToPoint', 'goToSingleView', 'toggleMode']), _propTypes["default"].func]),
  /**
   * Action to performe on double click: 'goToPoint', 'goToSingleView', 'toggleMode', or other
   */
  onDoubleClick: _propTypes["default"].oneOfType([_propTypes["default"].oneOf(['goToPoint', 'goToSingleView', 'toggleMode']), _propTypes["default"].func]),
  /**
   * Bool that defines the showing or not of the download button
   */
  showDownloadButton: _propTypes["default"].bool,
  /**
   * Callback function to be called after load is complete
   */
  onLoaded: _propTypes["default"].func,
  /**
   * Options to customize the toolbar
   */
  toolbarOptions: _propTypes["default"].shape({
    /**
     * Reference to toolbar component
     */
    instance: _propTypes["default"].elementType,
    /**
     * Custom toolbar props
     */
    props: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the toolbar container
     */
    containerStyles: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the toolbar
     */
    toolBarClassName: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the inner div
     */
    innerDivStyles: _propTypes["default"].shape({}),
    /**
     * Styles to be applied to the buttons
     */
    buttonStyles: _propTypes["default"].shape({})
  }),
  /**
   * Options to customize the loader
   */
  loaderOptions: _propTypes["default"].shape({
    /**
     * Reference to toolbar component
     */
    instance: _propTypes["default"].elementType,
    /**
     * Custom loader props
     */
    props: _propTypes["default"].shape({}),
    /**
     * Bool to control the use of the loader
     */
    showLoader: _propTypes["default"].bool,
    /**
     * Function to handle the close of the Loader
     */
    handleClose: _propTypes["default"].func,
    /**
     * Array of Custom messages to display
     */
    messages: _propTypes["default"].array,
    /**
     * Number of milliseconds between custom messages
     */
    messagesInterval: _propTypes["default"].number,
    /**
     * Number of the progress value to show in linear determinate (in percentage)
     */
    elapsed: _propTypes["default"].number,
    /**
     * Style to be applied to the Loader background
     */
    backgroundStyle: _propTypes["default"].shape({
      /**
       * Loader's background color. Defaults to rgba(255,142,0,0.1)
       */
      backgroundColor: _propTypes["default"].string
    })
  })
};
var _default = exports["default"] = (0, _core.withStyles)(styles)(DicomViewer);
//# sourceMappingURL=DicomViewer.js.map