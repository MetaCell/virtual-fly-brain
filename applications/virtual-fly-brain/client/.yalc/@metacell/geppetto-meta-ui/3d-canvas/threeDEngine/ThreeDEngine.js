"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var THREE = _interopRequireWildcard(require("three"));
var _RenderPass = require("three/examples/jsm/postprocessing/RenderPass.js");
var _EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer.js");
var _ShaderPass = require("three/examples/jsm/postprocessing/ShaderPass.js");
var _BloomPass = require("three/examples/jsm/postprocessing/BloomPass.js");
var _FilmPass = require("three/examples/jsm/postprocessing/FilmPass.js");
var _FocusShader = require("three/examples/jsm/shaders/FocusShader.js");
var _MeshFactory = _interopRequireDefault(require("./MeshFactory"));
var _Instance = _interopRequireDefault(require("@metacell/geppetto-meta-core/model/Instance"));
var _ArrayInstance = _interopRequireDefault(require("@metacell/geppetto-meta-core//model/ArrayInstance"));
var _Type = _interopRequireDefault(require("@metacell/geppetto-meta-core/model/Type"));
var _Variable = _interopRequireDefault(require("@metacell/geppetto-meta-core/model/Variable"));
var _SimpleInstance = _interopRequireDefault(require("@metacell/geppetto-meta-core/model/SimpleInstance"));
var _ModelFactory = _interopRequireDefault(require("@metacell/geppetto-meta-core/ModelFactory"));
var _Resources = _interopRequireDefault(require("@metacell/geppetto-meta-core/Resources"));
var _CameraManager = _interopRequireDefault(require("./CameraManager"));
var _TrackballControls = require("./TrackballControls");
var _util = require("./util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ThreeDEngine = exports["default"] = /*#__PURE__*/function () {
  function ThreeDEngine(containerRef, cameraOptions, cameraHandler, setColorHandler, backgroundColor, pickingEnabled, linesThreshold, renderingThreshold, onSelection, selectionStrategy, onHoverListeners, onEmptyHoverListener, preserveDrawingBuffer, dracoDecoderPath, renderingTheshold) {
    var _this = this;
    _classCallCheck(this, ThreeDEngine);
    /**
     * Set up the listeners use to detect mouse movement and window resizing
     */
    _defineProperty(this, "setupListeners", function () {
      _this.controls.addEventListener('start', _this.requestFrame);
      _this.controls.addEventListener('change', _this.requestFrame);
      _this.controls.addEventListener('stop', _this.stop);
      // when the mouse moves, call the given function
      _this.renderer.domElement.addEventListener('mousedown', _this.mouseDownEventListener, false);

      // when the mouse moves, call the given function
      _this.renderer.domElement.addEventListener('mouseup', _this.mouseUpEventListener, false);
      _this.renderer.domElement.addEventListener('mousemove', _this.mouseMoveEventListener, false);
    });
    _defineProperty(this, "mouseDownEventListener", function (event) {
      _this.clientX = event.clientX;
      _this.clientY = event.clientY;
    });
    _defineProperty(this, "mouseUpEventListener", function (event) {
      if (event.target === _this.renderer.domElement) {
        var x = event.clientX;
        var y = event.clientY;

        // if the mouse moved since the mousedown then don't consider this a selection
        if (typeof _this.clientX === 'undefined' || typeof _this.clientY === 'undefined' || x !== _this.clientX || y !== _this.clientY) {
          return;
        }
        _this.mouse.y = -((event.clientY - _this.renderer.domElement.getBoundingClientRect().top) * window.devicePixelRatio / _this.renderer.domElement.height) * 2 + 1;
        _this.mouse.x = (event.clientX - _this.renderer.domElement.getBoundingClientRect().left) * window.devicePixelRatio / _this.renderer.domElement.width * 2 - 1;
        if (_this.pickingEnabled) {
          var intersects = _this.getIntersectedObjects();
          if (intersects.length > 0) {
            // sort intersects
            var compare = function compare(a, b) {
              if (a.distance < b.distance) {
                return -1;
              }
              if (a.distance > b.distance) {
                return 1;
              }
              return 0;
            };
            intersects.sort(compare);
          }
          var selectedMap = {};
          // Iterate and get the first visible item (they are now ordered by proximity)
          for (var i = 0; i < intersects.length; i++) {
            // figure out if the entity is visible
            var instancePath = '';
            var externalMeshId = null;
            var geometryIdentifier = '';
            if (Object.prototype.hasOwnProperty.call(intersects[i].object, 'instancePath')) {
              instancePath = intersects[i].object.instancePath;
              geometryIdentifier = intersects[i].object.geometryIdentifier;
            } else if (Object.prototype.hasOwnProperty.call(intersects[i].object.parent, 'instancePath')) {
              instancePath = intersects[i].object.parent.instancePath;
              geometryIdentifier = intersects[i].object.parent.geometryIdentifier;
            } else {
              externalMeshId = intersects[i].object.uuid;
              geometryIdentifier = null;
            }
            if (instancePath != null && Object.prototype.hasOwnProperty.call(_this.meshFactory.meshes, instancePath) || Object.prototype.hasOwnProperty.call(_this.meshFactory.splitMeshes, instancePath)) {
              if (!(instancePath in selectedMap)) {
                selectedMap[instancePath] = _objectSpread(_objectSpread({}, intersects[i]), {}, {
                  geometryIdentifier: geometryIdentifier,
                  distanceIndex: i
                });
              }
            }
            if (externalMeshId != null) {
              if (!(externalMeshId in selectedMap)) {
                selectedMap[externalMeshId] = _objectSpread(_objectSpread({}, intersects[i]), {}, {
                  distanceIndex: i
                });
              }
            }
          }
          _this.requestFrame();
          _this.onSelection(_this.selectionStrategy(selectedMap), event);
        }
      }
    });
    _defineProperty(this, "mouseMoveEventListener", function (event) {
      _this.mouse.y = -((event.clientY - _this.renderer.domElement.getBoundingClientRect().top) * window.devicePixelRatio / _this.renderer.domElement.height) * 2 + 1;
      _this.mouse.x = (event.clientX - _this.renderer.domElement.getBoundingClientRect().left) * window.devicePixelRatio / _this.renderer.domElement.width * 2 - 1;
      _this.mouseContainer.x = event.clientX;
      _this.mouseContainer.y = event.clientY;
      if (_this.onHoverListeners && Object.keys(_this.onHoverListeners).length > 0) {
        var intersects = _this.getIntersectedObjects();
        for (var _i = 0, _Object$keys = Object.keys(_this.onHoverListeners); _i < _Object$keys.length; _i++) {
          var listener = _Object$keys[_i];
          if (intersects.length !== 0) {
            _this.onHoverListeners[listener](intersects, _this.mouseContainer.x, _this.mouseContainer.y);
          }
        }
        if (_this.onEmptyHoverListener && intersects.length === 0) _this.onEmptyHoverListener();
      }
    });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(backgroundColor);
    this.cameraManager = null;
    this.cameraOptions = cameraOptions;
    this.onSelection = onSelection;
    this.renderer = null;
    this.controls = null;
    this.mouse = {
      x: 0,
      y: 0
    };
    this.mouseContainer = {
      x: 0,
      y: 0
    };
    this.frameId = null;
    this.meshFactory = new _MeshFactory["default"](this.scene, linesThreshold, renderingThreshold, cameraOptions.depthWrite, 300, 1, null, dracoDecoderPath, null);
    this.pickingEnabled = pickingEnabled;
    this.onHoverListeners = onHoverListeners;
    this.onEmptyHoverListener = onEmptyHoverListener;
    this.cameraHandler = cameraHandler;
    this.setColorHandler = setColorHandler;
    this.selectionStrategy = selectionStrategy;
    this.containerRef = containerRef;
    this.width = containerRef.clientWidth;
    this.height = containerRef.clientHeight;
    this.lastRequestFrame = 0;
    this.lastRenderTimer = new Date();
    this.instancesMap = new Map();
    this.externalThreeDObjectsUUIDs = new Set();
    this.updateInstances = this.updateInstances.bind(this);
    this.updateCamera = this.updateCamera.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.resize = this.resize.bind(this);
    this.requestFrame = this.requestFrame.bind(this);
    this.mouseDownEventListener = this.mouseDownEventListener.bind(this);
    this.mouseUpEventListener = this.mouseUpEventListener.bind(this);
    this.mouseMoveEventListener = this.mouseMoveEventListener.bind(this);
    this.setupRenderer = this.setupRenderer.bind(this);
    this.setupListeners = this.setupListeners.bind(this);
    this.setOnHoverListeners = this.setOnHoverListeners.bind(this);
    this.setOnEmptyHoverListener = this.setOnEmptyHoverListener.bind(this);

    // Setup Camera
    this.setupCamera(cameraOptions, this.width / this.height);

    // Setup Renderer
    this.setupRenderer(containerRef, {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: preserveDrawingBuffer
    });

    // Setup Lights
    this.setupLights();

    // Setup Controls
    this.setupControls();

    // Setup Listeners
    this.setupListeners();
  }

  /**
   * Setups the camera
   * @param cameraOptions
   * @param aspect
   */
  return _createClass(ThreeDEngine, [{
    key: "setupCamera",
    value: function setupCamera(cameraOptions, aspect) {
      this.cameraManager = new _CameraManager["default"](this, _objectSpread(_objectSpread({}, cameraOptions), {}, {
        aspect: aspect
      }));
    }

    /**
     * Setups the renderer
     * @param containerRef
     */
  }, {
    key: "setupRenderer",
    value: function setupRenderer(containerRef, options) {
      this.renderer = new THREE.WebGLRenderer(options);
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.autoClear = false;
      containerRef.appendChild(this.renderer.domElement);
      this.configureRenderer(false);
    }

    /**
     *
     * @param shaders
     */
  }, {
    key: "configureRenderer",
    value: function configureRenderer(shaders) {
      if (shaders === undefined) {
        shaders = false;
      }
      var renderModel = new _RenderPass.RenderPass(this.scene, this.cameraManager.getCamera());
      this.composer = new _EffectComposer.EffectComposer(this.renderer);
      if (shaders) {
        var effectBloom = new _BloomPass.BloomPass(0.75);
        // todo: grayscale shouldn't be false
        var effectFilm = new _FilmPass.FilmPass(0.5, 0.5, 1448, false);
        var effectFocus = new _ShaderPass.ShaderPass(_FocusShader.FocusShader);
        effectFocus.uniforms['screenWidth'].value = this.width;
        effectFocus.uniforms['screenHeight'].value = this.height;
        effectFocus.renderToScreen = true;
        this.composer.addPass(renderModel);
        this.composer.addPass(effectBloom);
        this.composer.addPass(effectFilm);
        this.composer.addPass(effectFocus);
      } else {
        // standard
        renderModel.renderToScreen = true;
        this.composer.addPass(renderModel);
      }
    }

    /**
     * Setups the lights
     */
  }, {
    key: "setupLights",
    value: function setupLights() {
      var _this$cameraOptions, _this$cameraOptions2, _this$cameraOptions3;
      var ambientLight = new THREE.AmbientLight(0x0c0c0c);
      this.scene.add(ambientLight);
      var spotLight = new THREE.SpotLight(0xffffff);
      if ((_this$cameraOptions = this.cameraOptions) !== null && _this$cameraOptions !== void 0 && (_this$cameraOptions = _this$cameraOptions.spotlightPosition) !== null && _this$cameraOptions !== void 0 && _this$cameraOptions.x && (_this$cameraOptions2 = this.cameraOptions) !== null && _this$cameraOptions2 !== void 0 && (_this$cameraOptions2 = _this$cameraOptions2.spotlightPosition) !== null && _this$cameraOptions2 !== void 0 && _this$cameraOptions2.y && (_this$cameraOptions3 = this.cameraOptions) !== null && _this$cameraOptions3 !== void 0 && (_this$cameraOptions3 = _this$cameraOptions3.spotlightPosition) !== null && _this$cameraOptions3 !== void 0 && _this$cameraOptions3.z) {
        spotLight.position.set(this.cameraOptions.spotlightPosition.x, this.cameraOptions.spotlightPosition.y, this.cameraOptions.spotlightPosition.z);
      } else {
        spotLight.position.set(0, 0, 0);
      }
      spotLight.castShadow = true;
      this.scene.add(spotLight);
      this.cameraManager.getCamera().add(new THREE.PointLight(0xffffff, 1));
    }
  }, {
    key: "setupControls",
    value: function setupControls() {
      var defaultTrackballConfig = {
        rotationSpeed: 1.0,
        zoomSpeed: 1.2,
        panSpeed: 0.3
      };
      var trackballControls = this.cameraOptions.trackballControls;
      var trackballConfig = trackballControls ? trackballControls : defaultTrackballConfig;
      this.controls = new _TrackballControls.TrackballControls(this.cameraManager.getCamera(), this.renderer.domElement, this.cameraHandler, trackballConfig);
      this.controls.noZoom = false;
      this.controls.noPan = false;
    }
  }, {
    key: "updateInstances",
    value: function () {
      var _updateInstances = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(proxyInstances) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.clearScene(proxyInstances);
            case 2:
              proxyInstances = _context.sent;
              _context.next = 5;
              return this.addInstancesToScene(proxyInstances);
            case 5:
              this.updateVisibleChildren();
              this.updateInstancesColor(proxyInstances);
              this.updateInstancesConnectionLines(proxyInstances);
              this.scene.updateMatrixWorld(true);
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function updateInstances(_x) {
        return _updateInstances.apply(this, arguments);
      }
      return updateInstances;
    }()
  }, {
    key: "updateExternalThreeDObjects",
    value: function updateExternalThreeDObjects(threeDObjects) {
      var _this2 = this;
      var nextObjsUUIDs = new Set(threeDObjects.map(function (obj) {
        return obj.uuid;
      }));
      var toRemoveUUIDs = _toConsumableArray(this.externalThreeDObjectsUUIDs).filter(function (x) {
        return !nextObjsUUIDs.has(x);
      });
      toRemoveUUIDs.forEach(function (uuid) {
        _this2.scene.remove(_this2.scene.getObjectByProperty('uuid', uuid));
      });
      threeDObjects.forEach(function (element) {
        _this2.addToScene(element); // already checks if object is already in the scene
        _this2.externalThreeDObjectsUUIDs.add(element.uuid);
      });
      this.updateVisibleChildren();
    }
  }, {
    key: "updateCamera",
    value: function updateCamera(cameraOptions) {
      this.cameraManager.update(cameraOptions);
    }
  }, {
    key: "stop",
    value: function stop() {
      cancelAnimationFrame(this.frameId);
    }

    /**
     * Adds instances to the ThreeJS Scene
     * @param proxyInstances
     */
  }, {
    key: "addInstancesToScene",
    value: (function () {
      var _addInstancesToScene = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(proxyInstances) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.meshFactory.start(this.instancesMap);
            case 2:
              this.updateGroupMeshes(proxyInstances);
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function addInstancesToScene(_x2) {
        return _addInstancesToScene.apply(this, arguments);
      }
      return addInstancesToScene;
    }())
  }, {
    key: "addToScene",
    value: function addToScene(obj) {
      var found = false;
      var _iterator = _createForOfIteratorHelper(this.scene.children),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var child = _step.value;
          if (obj.instancePath && obj.instancePath === child.instancePath || child.uuid === obj.uuid) {
            found = true;
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (!found) {
        this.scene.add(obj);
      }
    }
  }, {
    key: "clearScene",
    value: function () {
      var _clearScene = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(proxyInstances) {
        var _this3 = this;
        var sortedInstances, toRemove;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              // safe check, if something different than an array is given we wipe the canvas.
              if (!Array.isArray(proxyInstances) && proxyInstances === undefined) {
                console.error("The Geppetto ThreeDEngine has been given an invalid object instead of a list of proxy instances, please check your usage of the 3D Canvas");
                proxyInstances = [];
              }
              this.instancesMap.clear();
              sortedInstances = (0, _util.sortInstances)(proxyInstances); // traverse all the geppetto instances
              sortedInstances.forEach(function (instance) {
                var geppettoInstance = Instances.getInstance(instance.instancePath);
                if (geppettoInstance) {
                  _this3.traverseInstance(instance, geppettoInstance);
                }
              });
              toRemove = this.scene.children.filter(function (child) {
                var mappedInstance = _this3.instancesMap.get(child.instancePath);
                if (child.instancePath !== undefined) {
                  if (!mappedInstance || mappedInstance.visibility === false) {
                    return true;
                  }
                  if (_this3.checkMaterial(child, mappedInstance) && mappedInstance) {
                    _this3.updateInstanceMaterial(child, mappedInstance);
                  }
                }
                return false;
              });
              toRemove.forEach(function (child) {
                _this3.meshFactory.cleanWith3DObject(child);
                _this3.scene.remove(child);
              });
              return _context3.abrupt("return", sortedInstances);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function clearScene(_x3) {
        return _clearScene.apply(this, arguments);
      }
      return clearScene;
    }()
  }, {
    key: "traverseInstance",
    value: function traverseInstance(proxyInstance, geppettoInstance) {
      try {
        if ((0, _util.hasVisualValue)(geppettoInstance)) {
          this.instancesMap.set(geppettoInstance.getInstancePath(), proxyInstance);
        } else if ((0, _util.hasVisualType)(geppettoInstance)) {
          if (geppettoInstance.getType().getMetaType() !== _Resources["default"].ARRAY_TYPE_NODE && geppettoInstance.getVisualType()) {
            this.instancesMap.set(geppettoInstance.getInstancePath(), proxyInstance);
          }
          if (geppettoInstance.getMetaType() === _Resources["default"].INSTANCE_NODE) {
            var children = geppettoInstance.getChildren();
            for (var i = 0; i < children.length; i++) {
              this.traverseInstance(proxyInstance, children[i]);
            }
          } else if (geppettoInstance.getMetaType() === _Resources["default"].ARRAY_INSTANCE_NODE) {
            for (var _i2 = 0; _i2 < geppettoInstance.length; _i2++) {
              this.traverseInstance(proxyInstance, geppettoInstance[_i2]);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    /**
     * Returns intersected objects from mouse click
     *
     * @returns {Array} a list of objects intersected by the current mouse coordinates
     */
  }, {
    key: "getIntersectedObjects",
    value: function getIntersectedObjects() {
      // create a Ray with origin at the mouse position and direction into th scene (camera direction)
      var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
      vector.unproject(this.cameraManager.getCamera());
      var raycaster = new THREE.Raycaster(this.cameraManager.getCamera().position, vector.sub(this.cameraManager.getCamera().position).normalize());
      raycaster.linePrecision = this.meshFactory.getLinePrecision();

      // returns an array containing all objects in the scene with which the ray intersects
      return raycaster.intersectObjects(this.visibleChildren);
    }
  }, {
    key: "updateVisibleChildren",
    value: function updateVisibleChildren() {
      var _this4 = this;
      this.visibleChildren = [];
      this.scene.traverse(function (child) {
        if (child.visible && !(child.clickThrough === true)) {
          if (child.geometry != null) {
            if (child.type !== 'Points') {
              child.geometry.computeBoundingBox();
            }
            _this4.visibleChildren.push(child);
          }
        }
      });
    }

    /**
     * Check that the material for the already present instance did not change.
     * return true if the color changed, otherwise false.
     */
  }, {
    key: "checkMaterial",
    value: function checkMaterial(mesh, instance) {
      if (mesh.type === 'Mesh' || mesh.type === 'LineSegment') {
        var _instance$color, _instance$color2, _instance$color3, _instance$color4;
        if (mesh.material.color.r === (instance === null || instance === void 0 || (_instance$color = instance.color) === null || _instance$color === void 0 ? void 0 : _instance$color.r) && mesh.material.color.g === (instance === null || instance === void 0 || (_instance$color2 = instance.color) === null || _instance$color2 === void 0 ? void 0 : _instance$color2.g) && mesh.material.color.b === (instance === null || instance === void 0 || (_instance$color3 = instance.color) === null || _instance$color3 === void 0 ? void 0 : _instance$color3.b) && mesh.material.color.opacity === (instance === null || instance === void 0 || (_instance$color4 = instance.color) === null || _instance$color4 === void 0 ? void 0 : _instance$color4.a)) {
          return false;
        } else {
          return true;
        }
      } else if (mesh.type === 'Group') {
        var changed = false;
        var _iterator2 = _createForOfIteratorHelper(mesh.children),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var child = _step2.value;
            if (this.checkMaterial(child, instance)) {
              changed = true;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return changed;
      }
    }
  }, {
    key: "updateInstanceMaterial",
    value: function updateInstanceMaterial(mesh, instance) {
      var _iterator3 = _createForOfIteratorHelper(this.scene.children),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var child = _step3.value;
          if (child.instancePath === mesh.instancePath && child.uuid === mesh.uuid) {
            if ((instance === null || instance === void 0 ? void 0 : instance.color) !== undefined) {
              this.setInstanceMaterial(child, instance);
              break;
            } else {
              instance.color = _Resources["default"].COLORS.DEFAULT;
              this.setInstanceMaterial(child, instance);
            }
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "setInstanceMaterial",
    value: function setInstanceMaterial(mesh, instance) {
      if (mesh.type === 'Mesh') {
        this.meshFactory.setThreeColor(mesh.material.color, instance.color);
        if (instance.color.a) {
          mesh.material.transparent = true;
          mesh.material.opacity = instance.color.a;
        }
      } else if (mesh.type === 'Group') {
        var _iterator4 = _createForOfIteratorHelper(mesh.children),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var child = _step4.value;
            this.setInstanceMaterial(child, instance);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  }, {
    key: "updateInstancesColor",
    value: function updateInstancesColor(proxyInstances) {
      var sortedInstances = proxyInstances.sort(function (a, b) {
        if (a.instancePath < b.instancePath) {
          return -1;
        }
        if (a.instancePath > b.instancePath) {
          return 1;
        }
        return 0;
      });
      var _iterator5 = _createForOfIteratorHelper(sortedInstances),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var pInstance = _step5.value;
          if (pInstance.color) {
            this.setInstanceColor(pInstance.instancePath, pInstance.color);
          }
          if (pInstance.visualGroups) {
            var instance = Instances.getInstance(pInstance.instancePath);
            var visualGroups = this.getVisualElements(instance, pInstance.visualGroups);
            this.setSplitGroupsColor(pInstance.instancePath, visualGroups);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }

    /**
     * Sets the color of the instances
     *
     * @param path
     * @param color
     */
  }, {
    key: "setInstanceColor",
    value: function setInstanceColor(path, color) {
      var entity = Instances.getInstance(path);
      if (entity && this.setColorHandler(entity)) {
        if (entity instanceof _Instance["default"] || entity instanceof _ArrayInstance["default"] || entity instanceof _SimpleInstance["default"]) {
          this.meshFactory.setColor(path, color);
          if (typeof entity.getChildren === 'function') {
            var children = entity.getChildren();
            for (var i = 0; i < children.length; i++) {
              this.setInstanceColor(children[i].getInstancePath(), color);
            }
          }
        } else if (entity instanceof _Type["default"] || entity instanceof _Variable["default"]) {
          // fetch all instances for the given type or variable and call hide on each
          var instances = _ModelFactory["default"].getAllInstancesOf(entity);
          for (var j = 0; j < instances.length; j++) {
            this.setInstanceColor(instances[j].getInstancePath(), color);
          }
        }
      }
    }

    /**
     *
     * @param instancePath
     * @param visualGroups
     */
  }, {
    key: "setSplitGroupsColor",
    value: function setSplitGroupsColor(instancePath, visualGroups) {
      for (var g in visualGroups) {
        // retrieve visual group object
        var group = visualGroups[g];

        // get full group name to access group mesh
        var groupName = g;
        if (groupName.indexOf(instancePath) <= -1) {
          groupName = instancePath + '.' + g;
        }

        // get group mesh
        var groupMesh = this.meshFactory.getMeshes()[groupName];
        groupMesh.visible = true;
        this.meshFactory.setThreeColor(groupMesh.material.color, group.color);
      }
    }
  }, {
    key: "updateGroupMeshes",
    value: function updateGroupMeshes(proxyInstances) {
      var _iterator6 = _createForOfIteratorHelper(proxyInstances),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var pInstance = _step6.value;
          if (pInstance.visualGroups) {
            var instance = Instances.getInstance(pInstance.instancePath);
            var visualGroups = this.getVisualElements(instance, pInstance.visualGroups);
            this.meshFactory.splitGroups(instance, visualGroups);
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      var meshes = this.meshFactory.getMeshes();
      for (var meshKey in meshes) {
        this.addToScene(meshes[meshKey]);
      }
    }
  }, {
    key: "getVisualElements",
    value: function getVisualElements(instance, visualGroups) {
      var groups = {};
      if (visualGroups.index != null) {
        var vg = instance.getVisualGroups()[visualGroups.index];
        var visualElements = vg.getVisualGroupElements();
        var allElements = [];
        for (var i = 0; i < visualElements.length; i++) {
          if (visualElements[i].getValue() != null) {
            allElements.push(visualElements[i].getValue());
          }
        }
        var minDensity = Math.min.apply(null, allElements);
        var maxDensity = Math.max.apply(null, allElements);

        // highlight all reference nodes
        for (var j = 0; j < visualElements.length; j++) {
          groups[visualElements[j].getId()] = {};
          var color = visualElements[j].getColor();
          if (visualElements[j].getValue() != null) {
            var intensity = 1;
            if (maxDensity !== minDensity) {
              intensity = (visualElements[j].getValue() - minDensity) / (maxDensity - minDensity);
            }
            color = (0, _util.rgbToHex)(255, Math.floor(255 - 255 * intensity), 0);
          }
          groups[visualElements[j].getId()].color = color;
        }
      }
      for (var c in visualGroups.custom) {
        if (c in groups) {
          groups[c].color = visualGroups.custom[c].color;
        }
      }
      return groups;
    }
    /**
     * Show connection lines for this instance.
     *
     * @param instancePath
     * @param {boolean} mode - Show or hide connection lines
     */
  }, {
    key: "showConnectionLines",
    value: function showConnectionLines(instancePath, mode) {
      if (mode == null) {
        mode = true;
      }
      var entity = Instances.getInstance(instancePath);
      if (entity instanceof _Instance["default"] || entity instanceof _ArrayInstance["default"]) {
        // show or hide connection lines
        if (mode) {
          this.showConnectionLinesForInstance(entity);
        } else {
          this.removeConnectionLines(entity);
        }
      } else if (entity instanceof _Type["default"] || entity instanceof _Variable["default"]) {
        // fetch all instances for the given type or variable and call hide on each
        var instances = _ModelFactory["default"].getAllInstancesOf(entity);
        for (var j = 0; j < instances.length; j++) {
          if ((0, _util.hasVisualType)(instances[j])) {
            this.showConnectionLines(instances[j], mode);
          }
        }
      }
    }

    /**
     *
     *
     * @param instance
     */
  }, {
    key: "showConnectionLinesForInstance",
    value: function showConnectionLinesForInstance(instance) {
      var connections = instance.getConnections();
      var mesh = this.meshFactory.meshes[instance.getInstancePath()];
      var inputs = {};
      var outputs = {};
      var defaultOrigin = mesh.position.clone();
      for (var c = 0; c < connections.length; c++) {
        var connection = connections[c];
        var type = connection.getA().getPath() === instance.getInstancePath() ? _Resources["default"].OUTPUT : _Resources["default"].INPUT;
        var thisEnd = connection.getA().getPath() === instance.getInstancePath() ? connection.getA() : connection.getB();
        var otherEnd = connection.getA().getPath() === instance.getInstancePath() ? connection.getB() : connection.getA();
        var otherEndPath = otherEnd.getPath();
        var otherEndMesh = this.meshFactory.meshes[otherEndPath];
        var destination = void 0;
        var origin = void 0;
        if (thisEnd.getPoint() === undefined) {
          // same as before
          origin = defaultOrigin;
        } else {
          // the specified coordinate
          var p = thisEnd.getPoint();
          origin = new THREE.Vector3(p.x + mesh.position.x, p.y + mesh.position.y, p.z + mesh.position.z);
        }
        if (otherEnd.getPoint() === undefined) {
          // same as before
          destination = otherEndMesh.position.clone();
        } else {
          // the specified coordinate
          var _p = otherEnd.getPoint();
          destination = new THREE.Vector3(_p.x + otherEndMesh.position.x, _p.y + otherEndMesh.position.y, _p.z + otherEndMesh.position.z);
        }
        var geometry = new THREE.Geometry();
        geometry.vertices.push(origin, destination);
        geometry.verticesNeedUpdate = true;
        geometry.dynamic = true;
        var colour = null;
        if (type === _Resources["default"].INPUT) {
          colour = _Resources["default"].COLORS.INPUT_TO_SELECTED;

          // figure out if connection is both, input and output
          if (outputs[otherEndPath]) {
            colour = _Resources["default"].COLORS.INPUT_AND_OUTPUT;
          }
          if (inputs[otherEndPath]) {
            inputs[otherEndPath].push(connection.getInstancePath());
          } else {
            inputs[otherEndPath] = [];
            inputs[otherEndPath].push(connection.getInstancePath());
          }
        } else if (type === _Resources["default"].OUTPUT) {
          colour = _Resources["default"].COLORS.OUTPUT_TO_SELECTED;
          // figure out if connection is both, input and output
          if (inputs[otherEndPath]) {
            colour = _Resources["default"].COLORS.INPUT_AND_OUTPUT;
          }
          if (outputs[otherEndPath]) {
            outputs[otherEndPath].push(connection.getInstancePath());
          } else {
            outputs[otherEndPath] = [];
            outputs[otherEndPath].push(connection.getInstancePath());
          }
        }
        var material = new THREE.LineDashedMaterial({
          dashSize: 3,
          gapSize: 1
        });
        this.meshFactory.setThreeColor(material.color, colour);
        var line = new THREE.LineSegments(geometry, material);
        line.updateMatrixWorld(true);
        if (this.meshFactory.connectionLines[connection.getInstancePath()]) {
          this.scene.remove(this.meshFactory.connectionLines[connection.getInstancePath()]);
        }
        this.scene.add(line);
        this.meshFactory.connectionLines[connection.getInstancePath()] = line;
      }
    }
  }, {
    key: "updateInstancesConnectionLines",
    value: function updateInstancesConnectionLines(proxyInstances) {
      var _iterator7 = _createForOfIteratorHelper(proxyInstances),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var pInstance = _step7.value;
          var mode = pInstance.showConnectionLines ? pInstance.showConnectionLines : false;
          this.showConnectionLines(pInstance.instancePath, mode);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }

    /**
     * Removes connection lines, all if nothing is passed in or just the ones passed in.
     *
     * @param instance - optional, instance for which we want to remove the connections
     */
  }, {
    key: "removeConnectionLines",
    value: function removeConnectionLines(instance) {
      if (instance !== undefined) {
        var connections = instance.getConnections();
        // get connections for given instance and remove only those
        var lines = this.meshFactory.connectionLines;
        for (var i = 0; i < connections.length; i++) {
          if (Object.prototype.hasOwnProperty.call(lines, connections[i].getInstancePath())) {
            // remove the connection line from the scene
            this.scene.remove(lines[connections[i].getInstancePath()]);
            // remove the conneciton line from the GEPPETTO list of connection lines
            delete lines[connections[i].getInstancePath()];
          }
        }
      } else {
        // remove all connection lines
        var _lines = this.meshFactory.connectionLines;
        for (var key in _lines) {
          if (Object.prototype.hasOwnProperty.call(_lines, key)) {
            this.scene.remove(_lines[key]);
          }
        }
        this.meshFactory.connectionLines = [];
      }
    }

    /**
     * Sets whether to use wireframe for the materials of the meshes
     * @param wireframe
     */
  }, {
    key: "setWireframe",
    value: function setWireframe(wireframe) {
      this.wireframe = wireframe;
      var that = this;
      this.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          if (!(child.material.nowireframe === true)) {
            child.material.wireframe = that.wireframe;
          }
        }
      });
    }
  }, {
    key: "setBackgroundColor",
    value: function setBackgroundColor(color) {
      this.scene.background.getHex();
      var newColor = new THREE.Color(color);
      if (this.scene.background.getHex() !== newColor.getHex()) {
        this.scene.background = newColor;
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.width !== this.containerRef.clientWidth || this.height !== this.containerRef.clientHeight) {
        this.width = this.containerRef.clientWidth;
        this.height = this.containerRef.clientHeight;
        this.cameraManager.camera.aspect = this.width / this.height;
        this.cameraManager.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
        /*
         * TOFIX: this above is just an hack to trigger the ratio to be recalculated, without the line below
         * the resizing works but the image gets stretched.
         */
        this.cameraManager.engine.controls.updateOnResize();
      }
    }
  }, {
    key: "requestFrame",
    value: function requestFrame() {
      var timeDif = this.lastRenderTimer.getTime() - new Date().getTime();
      if (Math.abs(timeDif) > 10) {
        this.lastRenderTimer = new Date();
        this.frameId = window.requestAnimationFrame(this.animate);
      }
    }
  }, {
    key: "animate",
    value: function animate() {
      this.controls.update();
      this.renderScene();
    }
  }, {
    key: "updateControls",
    value: function updateControls() {
      this.controls.update();
    }
  }, {
    key: "renderScene",
    value: function renderScene() {
      this.renderer.render(this.scene, this.cameraManager.getCamera());
    }

    /**
     * Returns the scene renderer
     * @returns renderer
     */
  }, {
    key: "getRenderer",
    value: function getRenderer() {
      return this.renderer;
    }
    /**
     * Returns the scene
     * @returns scene
     */
  }, {
    key: "getScene",
    value: function getScene() {
      return this.scene;
    }
    /**
     * Returns the wireframe flag
     * @returns wireframe
     */
  }, {
    key: "getWireframe",
    value: function getWireframe() {
      return this.wireframe;
    }

    /**
     * Sets onHoverListeners
     */
  }, {
    key: "setOnHoverListeners",
    value: function setOnHoverListeners(onHoverListeners) {
      this.onHoverListeners = onHoverListeners;
    }
  }, {
    key: "setOnEmptyHoverListener",
    value: function setOnEmptyHoverListener(onEmptyHoverListener) {
      this.onEmptyHoverListener = onEmptyHoverListener;
    }
    /**
     * Sets selectionStrategy
     */
  }, {
    key: "setSelectionStrategy",
    value: function setSelectionStrategy(selectionStrategy) {
      this.selectionStrategy = selectionStrategy;
    }
    /**
     * Sets onSelection
     */
  }, {
    key: "setOnSelection",
    value: function setOnSelection(onSelection) {
      this.onSelection = onSelection;
    }
    /**
     * Sets linesThreshold
     */
  }, {
    key: "setLinesThreshold",
    value: function setLinesThreshold(linesThreshold) {
      this.meshFactory.setLinesThreshold(linesThreshold);
    }
    /**
     * Sets pickingEnabled
     */
  }, {
    key: "setPickingEnabled",
    value: function setPickingEnabled(pickingEnabled) {
      this.pickingEnabled = pickingEnabled;
    }
    /**
     * Sets cameraHandler
     */
  }, {
    key: "seCameraHandler",
    value: function seCameraHandler(cameraHandler) {
      this.cameraHandler = cameraHandler;
    }
    /**
     * Sets setColorHandler
     */
  }, {
    key: "setSetColorHandler",
    value: function setSetColorHandler(setColorHandler) {
      this.setColorHandler = setColorHandler;
    }
  }]);
}();
//# sourceMappingURL=ThreeDEngine.js.map