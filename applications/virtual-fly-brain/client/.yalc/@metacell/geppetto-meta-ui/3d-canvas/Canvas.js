"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@material-ui/core");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ThreeDEngine = _interopRequireDefault(require("./threeDEngine/ThreeDEngine"));
var _CameraControls = _interopRequireWildcard(require("../camera-controls/CameraControls"));
var _SelectionManager = require("./threeDEngine/SelectionManager");
var _reactResizeDetector = _interopRequireDefault(require("react-resize-detector"));
var _Recorder = require("./captureManager/Recorder");
var _Screenshoter = require("./captureManager/Screenshoter");
var _CaptureControls = require("../capture-controls/CaptureControls");
var _util = require("./threeDEngine/util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
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
var styles = function styles() {
  return {
    container: {
      height: '100%',
      width: '100%'
    }
  };
};
var Canvas = /*#__PURE__*/function (_Component) {
  function Canvas(props) {
    var _this;
    _classCallCheck(this, Canvas);
    _this = _callSuper(this, Canvas, [props]);
    _this.sceneRef = /*#__PURE__*/_react["default"].createRef();
    _this.cameraControls = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      isCanvasReady: false,
      error: null
    };
    _this.constructorFromProps(props);
    _this.onResize = _this.onResize.bind(_this);
    _this.defaultCameraControlsHandler = _this.defaultCameraControlsHandler.bind(_this);
    _this.defaultCaptureControlsHandler = _this.defaultCaptureControlsHandler.bind(_this);
    _this.keyboardEventHandler = _this.keyboardEventHandler.bind(_this);
    return _this;
  }
  _inherits(Canvas, _Component);
  return _createClass(Canvas, [{
    key: "constructorFromProps",
    value: function constructorFromProps(props) {
      if (props.captureOptions !== undefined) {
        this.captureControlsRef = /*#__PURE__*/_react["default"].createRef();
      }
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _this$props, data, cameraOptions, captureOptions, cameraHandler, setColorHandler, backgroundColor, threeDObjects, pickingEnabled, linesThreshold, renderingThreshold, onSelection, selectionStrategy, onHoverListeners, onEmptyHoverListener, onMount, onUpdateStart, onUpdateEnd, dracoDecoderPath, hasCaptureOptions;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _this$props = this.props, data = _this$props.data, cameraOptions = _this$props.cameraOptions, captureOptions = _this$props.captureOptions, cameraHandler = _this$props.cameraHandler, setColorHandler = _this$props.setColorHandler, backgroundColor = _this$props.backgroundColor, threeDObjects = _this$props.threeDObjects, pickingEnabled = _this$props.pickingEnabled, linesThreshold = _this$props.linesThreshold, renderingThreshold = _this$props.renderingThreshold, onSelection = _this$props.onSelection, selectionStrategy = _this$props.selectionStrategy, onHoverListeners = _this$props.onHoverListeners, onEmptyHoverListener = _this$props.onEmptyHoverListener, onMount = _this$props.onMount, onUpdateStart = _this$props.onUpdateStart, onUpdateEnd = _this$props.onUpdateEnd, dracoDecoderPath = _this$props.dracoDecoderPath;
              hasCaptureOptions = captureOptions !== undefined;
              this.threeDEngine = new _ThreeDEngine["default"](this.sceneRef.current, cameraOptions, cameraHandler, setColorHandler, backgroundColor, pickingEnabled, linesThreshold, renderingThreshold, onSelection, selectionStrategy, onHoverListeners, onEmptyHoverListener, hasCaptureOptions, dracoDecoderPath);
              onUpdateStart();
              _context.next = 6;
              return this.handleEngineUpdate(data);
            case 6:
              this.threeDEngine.updateExternalThreeDObjects(threeDObjects);
              this.threeDEngine.updateCamera(cameraOptions);
              onUpdateEnd();
              onMount(this.threeDEngine.scene);
              if (hasCaptureOptions) {
                // todo captureOptions prop should force recorderOptions attribute
                this.recorder = new _Recorder.Recorder(this.getCanvasElement(), captureOptions.recorderOptions);
              }
              this.setState({
                isCanvasReady: true
              });
              this.sceneRef.current.addEventListener('keydown', this.keyboardEventHandler);
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }
      return componentDidMount;
    }()
  }, {
    key: "handleEngineUpdate",
    value: function () {
      var _handleEngineUpdate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
        var updateResult;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return this.threeDEngine.updateInstances(data);
            case 3:
              updateResult = _context2.sent;
              return _context2.abrupt("return", updateResult);
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
              this.setState({
                error: _context2.t0
              });
            case 11:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 7]]);
      }));
      function handleEngineUpdate(_x) {
        return _handleEngineUpdate.apply(this, arguments);
      }
      return handleEngineUpdate;
    }()
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      return nextState.isCanvasReady || this.isResizeRequired() || nextProps !== this.props;
    }
  }, {
    key: "componentDidUpdate",
    value: function () {
      var _componentDidUpdate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(prevProps, prevState, snapshot) {
        var _this$props2, data, cameraOptions, captureOptions, cameraHandler, setColorHandler, backgroundColor, threeDObjects, pickingEnabled, linesThreshold, onSelection, selectionStrategy, onHoverListeners, onEmptyHoverListener, onUpdateStart, onUpdateEnd, prevData, prevCameraOptions, prevCaptureOptions, prevCameraHandler, prevSetColorHandler, prevBackgroundColor, prevThreeDObjects, prevPickingEnabled, prevLinesThreshold, prevOnSelection, prevSelectionStrategy, prevOnHoverListeners, prevOnEmptyHoverListener;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (this.isResizeRequired()) {
                this.threeDEngine.resize();
              }
              if (!(prevProps !== this.props)) {
                _context3.next = 25;
                break;
              }
              _this$props2 = this.props, data = _this$props2.data, cameraOptions = _this$props2.cameraOptions, captureOptions = _this$props2.captureOptions, cameraHandler = _this$props2.cameraHandler, setColorHandler = _this$props2.setColorHandler, backgroundColor = _this$props2.backgroundColor, threeDObjects = _this$props2.threeDObjects, pickingEnabled = _this$props2.pickingEnabled, linesThreshold = _this$props2.linesThreshold, onSelection = _this$props2.onSelection, selectionStrategy = _this$props2.selectionStrategy, onHoverListeners = _this$props2.onHoverListeners, onEmptyHoverListener = _this$props2.onEmptyHoverListener, onUpdateStart = _this$props2.onUpdateStart, onUpdateEnd = _this$props2.onUpdateEnd;
              prevData = prevProps.data, prevCameraOptions = prevProps.cameraOptions, prevCaptureOptions = prevProps.captureOptions, prevCameraHandler = prevProps.cameraHandler, prevSetColorHandler = prevProps.setColorHandler, prevBackgroundColor = prevProps.backgroundColor, prevThreeDObjects = prevProps.threeDObjects, prevPickingEnabled = prevProps.pickingEnabled, prevLinesThreshold = prevProps.linesThreshold, prevOnSelection = prevProps.onSelection, prevSelectionStrategy = prevProps.selectionStrategy, prevOnHoverListeners = prevProps.onHoverListeners, prevOnEmptyHoverListener = prevProps.onEmptyHoverListener;
              onUpdateStart();
              if (backgroundColor !== prevBackgroundColor) {
                this.threeDEngine.setBackgroundColor(backgroundColor);
              }
              if (!(0, _util.hasDifferentProxyInstances)(data, prevData)) {
                _context3.next = 9;
                break;
              }
              _context3.next = 9;
              return this.handleEngineUpdate(data);
            case 9:
              if (cameraOptions !== prevCameraOptions) {
                this.threeDEngine.updateCamera(cameraOptions);
              }
              if (Object.keys(onHoverListeners).sort().toString() !== Object.keys(prevOnHoverListeners).sort().toString()) {
                this.threeDEngine.setOnHoverListeners(onHoverListeners);
              }
              if (selectionStrategy !== prevSelectionStrategy) {
                this.threeDEngine.setSelectionStrategy(selectionStrategy);
              }
              if (onSelection !== prevOnSelection) {
                this.threeDEngine.setOnSelection(onSelection);
              }
              if (onEmptyHoverListener !== prevOnEmptyHoverListener) {
                this.threeDEngine.setOnEmptyHoverListener(onEmptyHoverListener);
              }
              if (linesThreshold !== prevLinesThreshold) {
                this.threeDEngine.setLinesThreshold(linesThreshold);
              }
              if (pickingEnabled !== prevPickingEnabled) {
                this.threeDEngine.setPickingEnabled(pickingEnabled);
              }
              if (cameraHandler !== prevCameraHandler) {
                this.threeDEngine.seCameraHandler(cameraHandler);
              }
              if (setColorHandler !== prevSetColorHandler) {
                this.threeDEngine.setSetColorHandler(setColorHandler);
              }
              if ((0, _util.hasDifferentThreeDObjects)(threeDObjects, prevThreeDObjects)) {
                this.threeDEngine.updateExternalThreeDObjects(threeDObjects);
              }
              this.threeDEngine.requestFrame();
              onUpdateEnd();
              if (captureOptions !== prevCaptureOptions) {
                if (captureOptions !== undefined) {
                  this.recorder = new _Recorder.Recorder(this.getCanvasElement(), captureOptions.recorderOptions);
                } else {
                  this.recorder = null;
                }
              }
              this.setState({
                isCanvasReady: true
              });
              _context3.next = 26;
              break;
            case 25:
              this.setState({
                isCanvasReady: false
              });
            case 26:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function componentDidUpdate(_x2, _x3, _x4) {
        return _componentDidUpdate.apply(this, arguments);
      }
      return componentDidUpdate;
    }()
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.threeDEngine.stop();
      this.sceneRef.current.removeChild(this.threeDEngine.getRenderer().domElement);
      this.sceneRef.current.removeEventListener('keydown', this.keyboardEventHandler);
    }
  }, {
    key: "keyboardEventHandler",
    value: function keyboardEventHandler(event) {
      switch (event.code) {
        case 'ArrowRight':
          this.defaultCameraControlsHandler(_CameraControls.cameraControlsActions.PAN_RIGHT);
          break;
        case 'ArrowLeft':
          this.defaultCameraControlsHandler(_CameraControls.cameraControlsActions.PAN_LEFT);
          break;
        case 'ArrowDown':
          this.defaultCameraControlsHandler(_CameraControls.cameraControlsActions.PAN_DOWN);
          break;
        case 'ArrowUp':
          this.defaultCameraControlsHandler(_CameraControls.cameraControlsActions.PAN_UP);
          break;
      }
    }
  }, {
    key: "isResizeRequired",
    value: function isResizeRequired() {
      return this.sceneRef.current.clientWidth !== this.threeDEngine.width || this.sceneRef.current.clientHeight !== this.threeDEngine.height;
    }
  }, {
    key: "onResize",
    value: function onResize(width, height, targetRef) {
      this.threeDEngine.resize();
    }
  }, {
    key: "getCanvasElement",
    value: function getCanvasElement() {
      return this.sceneRef.current && this.sceneRef.current.getElementsByTagName('canvas')[0];
    }
  }, {
    key: "defaultCaptureControlsHandler",
    value: function defaultCaptureControlsHandler(action) {
      var captureOptions = this.props.captureOptions;
      if (this.recorder) {
        switch (action.type) {
          case _CaptureControls.captureControlsActions.START:
            this.recorder.startRecording();
            break;
          case _CaptureControls.captureControlsActions.STOP:
            // eslint-disable-next-line no-case-declarations
            var options = action.data.options;
            return this.recorder.stopRecording(options);
          case _CaptureControls.captureControlsActions.DOWNLOAD_VIDEO:
            {
              var _action$data = action.data,
                filename = _action$data.filename,
                _options = _action$data.options;
              return this.recorder.download(filename, _options);
            }
        }
      }
      if (captureOptions && captureOptions.screenshotOptions) {
        var _captureOptions$scree = captureOptions.screenshotOptions,
          quality = _captureOptions$scree.quality,
          pixelRatio = _captureOptions$scree.pixelRatio,
          resolution = _captureOptions$scree.resolution,
          filter = _captureOptions$scree.filter;
        switch (action.type) {
          case _CaptureControls.captureControlsActions.DOWNLOAD_SCREENSHOT:
            {
              var _filename = action.data.filename;
              (0, _Screenshoter.downloadScreenshot)(this.getCanvasElement(), quality, resolution, pixelRatio, filter, _filename);
              break;
            }
        }
      }
    }
  }, {
    key: "defaultCameraControlsHandler",
    value: function defaultCameraControlsHandler(action) {
      var defaultProps = {
        incrementPan: {
          x: 0.01,
          y: 0.01
        },
        incrementRotation: {
          x: 0.01,
          y: 0.01,
          z: 0.01
        },
        incrementZoom: 0.01,
        movieFilter: false
      };
      var mergedProps = _objectSpread(_objectSpread({}, defaultProps), this.props.cameraOptions.cameraControls);
      var incrementPan = mergedProps.incrementPan,
        incrementRotation = mergedProps.incrementRotation,
        incrementZoom = mergedProps.incrementZoom,
        movieFilter = mergedProps.movieFilter;
      var _this$props$cameraOpt = this.props.cameraOptions,
        initialPosition = _this$props$cameraOpt.initialPosition,
        initialRotation = _this$props$cameraOpt.initialRotation,
        initialZoomTo = _this$props$cameraOpt.initialZoomTo;
      if (this.threeDEngine) {
        switch (action) {
          case _CameraControls.cameraControlsActions.PAN_LEFT:
            this.threeDEngine.cameraManager.incrementCameraPan(-incrementPan.x, 0);
            break;
          case _CameraControls.cameraControlsActions.PAN_RIGHT:
            this.threeDEngine.cameraManager.incrementCameraPan(incrementPan.x, 0);
            break;
          case _CameraControls.cameraControlsActions.PAN_UP:
            this.threeDEngine.cameraManager.incrementCameraPan(0, -incrementPan.y);
            break;
          case _CameraControls.cameraControlsActions.PAN_DOWN:
            this.threeDEngine.cameraManager.incrementCameraPan(0, incrementPan.y);
            break;
          case _CameraControls.cameraControlsActions.ROTATE_UP:
            this.threeDEngine.cameraManager.incrementCameraRotate(0, incrementRotation.y, undefined);
            break;
          case _CameraControls.cameraControlsActions.ROTATE_DOWN:
            this.threeDEngine.cameraManager.incrementCameraRotate(0, -incrementRotation.y, undefined);
            break;
          case _CameraControls.cameraControlsActions.ROTATE_LEFT:
            this.threeDEngine.cameraManager.incrementCameraRotate(-incrementRotation.x, 0, undefined);
            break;
          case _CameraControls.cameraControlsActions.ROTATE_RIGHT:
            this.threeDEngine.cameraManager.incrementCameraRotate(incrementRotation.x, 0, undefined);
            break;
          case _CameraControls.cameraControlsActions.ROTATE_Z:
            this.threeDEngine.cameraManager.incrementCameraRotate(0, 0, incrementRotation.z);
            break;
          case _CameraControls.cameraControlsActions.ROTATE_MZ:
            this.threeDEngine.cameraManager.incrementCameraRotate(0, 0, -incrementRotation.z);
            break;
          case _CameraControls.cameraControlsActions.ROTATE:
            this.threeDEngine.cameraManager.autoRotate(movieFilter); // movie filter
            break;
          case _CameraControls.cameraControlsActions.ZOOM_IN:
            this.threeDEngine.cameraManager.incrementCameraZoom(-incrementZoom);
            break;
          case _CameraControls.cameraControlsActions.ZOOM_OUT:
            this.threeDEngine.cameraManager.incrementCameraZoom(incrementZoom);
            break;
          case _CameraControls.cameraControlsActions.PAN_HOME:
            this.threeDEngine.cameraManager.resetCamera(initialPosition, initialRotation, initialZoomTo);
            break;
          case _CameraControls.cameraControlsActions.WIREFRAME:
            this.threeDEngine.setWireframe(!this.threeDEngine.getWireframe());
            break;
        }
        //this.threeDEngine.updateControls();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
        classes = _this$props3.classes,
        cameraOptions = _this$props3.cameraOptions,
        captureOptions = _this$props3.captureOptions;
      var cameraControls = cameraOptions.cameraControls;
      var cameraControlsHandler = cameraControls.cameraControlsHandler ? cameraControls.cameraControlsHandler : this.defaultCameraControlsHandler;
      var captureInstance = null;
      var error = this.state.error;
      if (error) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: classes.container
        }, /*#__PURE__*/_react["default"].createElement("p", null, "Error: ", error));
      }
      if (captureOptions) {
        var captureControls = captureOptions.captureControls;
        var captureControlsHandler = captureControls && captureControls.captureControlsHandler ? captureControls.captureControlsHandler : this.defaultCaptureControlsHandler;
        captureInstance = captureControls && captureControls.instance ? /*#__PURE__*/_react["default"].createElement(captureControls.instance, _extends({
          ref: this.captureControlsRef
        }, captureControls.props, {
          captureControlsHandler: captureControlsHandler
        })) : null;
      }
      return /*#__PURE__*/_react["default"].createElement(_reactResizeDetector["default"], {
        skipOnMount: "true",
        onResize: this.onResize
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: classes.container,
        ref: this.sceneRef,
        tabIndex: 0
      }, /*#__PURE__*/_react["default"].createElement(cameraControls.instance, _extends({
        ref: this.cameraControls
      }, cameraControls.props, {
        cameraControlsHandler: cameraControlsHandler
      })), captureInstance));
    }
  }]);
}(_react.Component);
Canvas.defaultProps = {
  cameraOptions: {
    angle: 50,
    near: 0.01,
    far: 1000,
    baseZoom: 1,
    reset: false,
    autorotate: false,
    wireframe: false,
    initialZoomTo: [],
    initialFlip: [],
    movieFilter: false,
    depthWrite: true,
    spotlightPosition: {
      x: 0,
      y: 0,
      z: 0
    },
    cameraControls: {
      instance: _CameraControls["default"],
      props: {
        wireframeButtonEnabled: false,
        cameraControlsHandler: null,
        buttonStyles: {
          color: '#fc6320'
        }
      },
      incrementsPan: {
        x: 0.05,
        y: 0.05
      },
      incrementRotation: {
        x: 0.05,
        y: 0.05,
        z: 0.05
      },
      incrementZoom: 0.5,
      reset: false
    },
    trackballControls: {
      rotationSpeed: 0.5,
      zoomSpeed: 1.2,
      panSpeed: 0.3
    }
  },
  captureOptions: {
    captureControls: {
      instance: null,
      props: {
        captureControlsHandler: null,
        buttonStyles: {
          color: '#fc6320'
        }
      },
      incrementPan: {
        x: 0.01,
        y: 0.01
      },
      incrementRotation: {
        x: 0.01,
        y: 0.01,
        z: 0.01
      },
      incrementZoom: 0.1
    },
    recorderOptions: {
      mediaRecorderOptions: {
        mimeType: 'video/webm'
      },
      blobOptions: {
        type: 'video/webm'
      }
    }
  },
  backgroundColor: 0x000000,
  pickingEnabled: true,
  linesThreshold: 2000,
  threeDObjects: [],
  cameraHandler: function cameraHandler() {},
  setColorHandler: function setColorHandler() {
    return true;
  },
  onSelection: function onSelection() {},
  selectionStrategy: _SelectionManager.selectionStrategies.nearest,
  onHoverListeners: {},
  onMount: function onMount() {},
  onUpdateStart: function onUpdateStart() {},
  onUpdateEnd: function onUpdateEnd() {},
  dracoDecoderPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
};
Canvas.propTypes = {
  /**
   * (Proxy) Instances to visualize
   */
  data: _propTypes["default"].array.isRequired,
  /**
   * Options to customize camera
   */
  cameraOptions: _propTypes["default"].shape({
    /**
     * Camera angle in canvas
     */
    angle: _propTypes["default"].number,
    /**
     * Near value
     */
    near: _propTypes["default"].number,
    /**
     * Far value
     */
    far: _propTypes["default"].number,
    /**
     * Base zoom value
     */
    baseZoom: _propTypes["default"].number,
    /**
     * Boolean to enable/disable reset
     */
    reset: _propTypes["default"].bool,
    /**
     * Boolean to enable/disable auto rotate
     */
    autorotate: _propTypes["default"].bool,
    /**
     * Boolean to enable/disable wireframe
     */
    wireframe: _propTypes["default"].bool,
    /**
     * Objects to zoom into
     */
    initialZoomTo: _propTypes["default"].arrayOf(_propTypes["default"].string),
    /**
     * Array of axis to flip
     */
    initialFlip: _propTypes["default"].arrayOf(_propTypes["default"].string),
    /**
     * Rotation speed
     */
    rotationSpeed: _propTypes["default"].number,
    /**
     * Boolean to enable/disable movie filter
     */
    movieFilter: _propTypes["default"].bool,
    /**
     * Spotlight position object to define x, y, and z values
     */
    spotlightPosition: _propTypes["default"].shape({
      x: _propTypes["default"].number,
      y: _propTypes["default"].number,
      z: _propTypes["default"].number
    }),
    /**
     * Position object to define x, y, and z values
     */
    initialPosition: _propTypes["default"].shape({
      x: _propTypes["default"].number,
      y: _propTypes["default"].number,
      z: _propTypes["default"].number
    }),
    /**
     * Rotation object to define rx, ry, rz, and radius values
     */
    initialRotation: _propTypes["default"].shape({
      rx: _propTypes["default"].number,
      ry: _propTypes["default"].number,
      rz: _propTypes["default"].number,
      radius: _propTypes["default"].number
    }),
    /**
     * Options to customize camera controls
     */
    cameraControls: _propTypes["default"].shape({
      /**
       * Reference to cameraControls instance
       */
      instance: _propTypes["default"].elementType,
      /**
       * CameraControls props
       */
      props: _propTypes["default"].shape({
        /**
         * Boolean to enable/disable wireframe button
         */
        wireframeButtonEnabled: _propTypes["default"].bool,
        /**
         * Function to callback on camera controls changes
         */
        cameraControlsHandler: _propTypes["default"].func,
        /**
         * Styles to apply on the icon button elements
         */
        buttonStyles: _propTypes["default"].any
      }),
      /**
       * Value for pan increment
       */
      incrementPan: _propTypes["default"].shape({
        x: _propTypes["default"].number,
        y: _propTypes["default"].number
      }),
      /**
       * Value for rotation increment
       */
      incrementRotation: _propTypes["default"].shape({
        x: _propTypes["default"].number,
        y: _propTypes["default"].number,
        z: _propTypes["default"].number
      }),
      /**
       * Value for zoom increment
       */
      incrementZoom: _propTypes["default"].number,
      /**
       * Boolean to enable/disable reset
       */
      reset: _propTypes["default"].bool
    }),
    /**
     * Options to customize trackball controls
     */
    trackballControls: _propTypes["default"].shape({
      /**
       * Value for the rotation speed triggered by the mouse
       */
      rotationSpeed: _propTypes["default"].number,
      /**
       * Value for the zoom increment triggered by the mouse
       */
      zoomSpeed: _propTypes["default"].number,
      /**
       * Value for the pan increment triggered by the mouse
       */
      panSpeed: _propTypes["default"].number
    })
  }),
  /**
   * Options to customize capture features
   */
  captureOptions: _propTypes["default"].shape({
    /**
     * Capture controls component definition
     */
    captureControls: _propTypes["default"].shape({
      /**
       * Component instance
       */
      instance: _propTypes["default"].elementType,
      /**
       * Component props
       */
      props: _propTypes["default"].shape({
        /**
         * Styles to apply on the icon button elements
         */
        buttonStyles: _propTypes["default"].any,
        /**
         * Function to callback on capture controls changes
         */
        captureControlsHandler: _propTypes["default"].func
      })
    }),
    /**
     * Recorder Options
     */
    recorderOptions: _propTypes["default"].shape({
      /**
       * Media Recorder options
       */
      mediaRecorderOptions: _propTypes["default"].shape({
        mimeType: _propTypes["default"].string
      }),
      blobOptions: _propTypes["default"].shape({
        type: _propTypes["default"].string
      })
    }),
    /**
     * Screenshot Options
     */
    screenshotOptions: _propTypes["default"].shape({
      /**
       * A function taking DOM node as argument. Should return true if passed node should be included in the output. Excluding node means excluding its children as well.
       */
      filter: _propTypes["default"].func,
      /**
       * The pixel ratio of the captured image. Default use the actual pixel ratio of the device. Set 1 to use as initial-scale 1 for the image.
       */
      pixelRatio: _propTypes["default"].number,
      /**
       * A number between 0 and 1 indicating image quality (e.g. 0.92 => 92%) of the JPEG image.
       */
      quality: _propTypes["default"].number,
      /**
       * Screenshot desired resolution
       */
      resolution: _propTypes["default"].shape({
        height: _propTypes["default"].number.isRequired,
        width: _propTypes["default"].number.isRequired
      })
    })
  }),
  /**
   * Three JS objects to add to the scene
   */
  threeDObjects: _propTypes["default"].array,
  /**
   * Function to callback on camera changes
   */
  cameraHandler: _propTypes["default"].func,
  /**
   * Function to callback on set color changes. Return true to apply default behavior after or false otherwise
   */
  setColorHandler: _propTypes["default"].func,
  /**
   * Scene background color
   */
  backgroundColor: _propTypes["default"].number,
  /**
   * Boolean to enable/disable 3d picking
   */
  pickingEnabled: _propTypes["default"].bool,
  /**
   * Threshold to limit scene complexity
   */
  linesThreshold: _propTypes["default"].number,
  /**
   * Map<string, function> of hover handlers to callback
   */
  onHoverListeners: _propTypes["default"].object,
  /**
   * Function to callback on selection changes
   */
  onSelection: _propTypes["default"].func,
  /**
   * Function to apply the selection strategy
   */
  selectionStrategy: _propTypes["default"].func,
  /**
   * Function to callback on component did mount with scene obj
   */
  onMount: _propTypes["default"].func,
  /**
   * Function to callback when the loading of elements of the canvas starts
   */
  onUpdateStart: _propTypes["default"].func,
  /**
   * Function to callback when the loading of elements of the canvas ends
   */
  onUpdateEnd: _propTypes["default"].func,
  /**
   * Path to the draco decoder
   */
  dracoDecoderPath: _propTypes["default"].string
};
var _default = exports["default"] = (0, _core.withStyles)(styles)(Canvas);
//# sourceMappingURL=Canvas.js.map