"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _particle = _interopRequireDefault(require("../textures/particle.png"));
var _util = require("./util");
var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");
var _OBJLoader = require("./OBJLoader");
var _DRACOLoader = require("three/examples/jsm/loaders/DRACOLoader");
var _ColladaLoader = require("three/examples/jsm/loaders/ColladaLoader");
var _ModelFactory = _interopRequireDefault(require("@metacell/geppetto-meta-core/ModelFactory"));
var _Resources = _interopRequireDefault(require("@metacell/geppetto-meta-core/Resources"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var MeshFactory = exports["default"] = /*#__PURE__*/function () {
  function MeshFactory(scene) {
    var linesThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
    var renderingTheshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
    var depthWrite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var linePrecisionMinRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 300;
    var minAllowedLinePrecision = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    var particleTexture = arguments.length > 6 ? arguments[6] : undefined;
    var dracoDecoderPath = arguments.length > 7 ? arguments[7] : undefined;
    var THREE = arguments.length > 8 ? arguments[8] : undefined;
    _classCallCheck(this, MeshFactory);
    this.scene = scene;
    this.depthWrite = depthWrite;
    this.meshes = {};
    this.splitMeshes = {};
    this.visualModelMap = {};
    this.connectionLines = {};
    this.complexity = 0;
    this.sceneMaxRadius = 0;
    this.linePrecisionMinRadius = linePrecisionMinRadius;
    this.minAllowedLinePrecision = minAllowedLinePrecision;
    this.linesThreshold = linesThreshold;
    this.renderingTheshold = renderingTheshold;
    this.particleTexture = particleTexture;
    this.dracoDecoderPath = dracoDecoderPath ? dracoDecoderPath : 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/';
    this.THREE = THREE ? THREE : require('three');
    this.THREE.Cache.enabled = true;
    this.setupLoaders();
    this.instancesMap = new Map();
  }
  return _createClass(MeshFactory, [{
    key: "setupLoaders",
    value: function setupLoaders() {
      var dracoLoader = new _DRACOLoader.DRACOLoader();
      dracoLoader.setDecoderPath(this.dracoDecoderPath);
      var manager = new this.THREE.LoadingManager();
      manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
      };
      var objLoader = new _OBJLoader.OBJLoader(manager);
      var gltfLoader = new _GLTFLoader.GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      this.loaders = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, _Resources["default"].GLTF, gltfLoader), _Resources["default"].DRC, dracoLoader), _Resources["default"].OBJ, objLoader), _Resources["default"].COLLADA, new _ColladaLoader.ColladaLoader()), 'TextureLoader', new this.THREE.TextureLoader());
    }
  }, {
    key: "start",
    value: function () {
      var _start = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(instancesMap) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.instancesMap = instancesMap;
              _context.next = 3;
              return this.traverseInstances(this.instancesMap);
            case 3:
              if (!(this.complexity > this.renderingTheshold)) {
                _context.next = 5;
                break;
              }
              throw "Fatal Error while attemping to render: Scene complextiy ".concat(this.complexity, " exceeds pre-defined completity theshold ").concat(this.renderingTheshold);
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function start(_x) {
        return _start.apply(this, arguments);
      }
      return start;
    }()
  }, {
    key: "getMeshes",
    value: function getMeshes() {
      var meshes = _objectSpread({}, this.splitMeshes);
      for (var m in this.meshes) {
        if (!(m in meshes)) {
          meshes[m] = this.meshes[m];
        }
      }
      return meshes;
    }
  }, {
    key: "traverseInstances",
    value: function () {
      var _traverseInstances = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(instances) {
        var _iterator, _step, mInstance, gInstance;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _iterator = _createForOfIteratorHelper(instances.entries());
              _context2.prev = 1;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context2.next = 19;
                break;
              }
              mInstance = _step.value;
              if (!(mInstance[1].visibility === false)) {
                _context2.next = 10;
                break;
              }
              delete this.meshes[mInstance[0]];
              return _context2.abrupt("return");
            case 10:
              if (!(this.meshes[mInstance[0]] !== undefined)) {
                _context2.next = 13;
                break;
              }
              if (mInstance[1].color !== undefined) {
                this.setColor(mInstance[0], mInstance[1].color);
              }
              return _context2.abrupt("continue", 17);
            case 13:
              gInstance = Instances.getInstance(mInstance[0]);
              _context2.next = 16;
              return this.buildVisualInstance(gInstance);
            case 16:
              if (mInstance[1].color !== undefined) {
                this.setColor(mInstance[0], mInstance[1].color);
              }
            case 17:
              _context2.next = 3;
              break;
            case 19:
              _context2.next = 24;
              break;
            case 21:
              _context2.prev = 21;
              _context2.t0 = _context2["catch"](1);
              _iterator.e(_context2.t0);
            case 24:
              _context2.prev = 24;
              _iterator.f();
              return _context2.finish(24);
            case 27:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[1, 21, 24, 27]]);
      }));
      function traverseInstances(_x2) {
        return _traverseInstances.apply(this, arguments);
      }
      return traverseInstances;
    }()
  }, {
    key: "buildVisualInstance",
    value: function () {
      var _buildVisualInstance = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(instance) {
        var instancePath, meshes;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              instancePath = instance.getInstancePath(); // If the same mesh already exists skip the recreation
              if (!this.meshes[instancePath]) {
                _context3.next = 5;
                break;
              }
              return _context3.abrupt("return");
            case 5:
              _context3.next = 7;
              return this.generate3DObjects(instance);
            case 7:
              meshes = _context3.sent;
              this.init3DObject(meshes, instance);
            case 9:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function buildVisualInstance(_x3) {
        return _buildVisualInstance.apply(this, arguments);
      }
      return buildVisualInstance;
    }()
  }, {
    key: "generate3DObjects",
    value: function () {
      var _generate3DObjects = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(instance) {
        var materials, instanceObjects, threeDeeObjList, mergedObjs, obj;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              materials = {
                mesh: this.getMeshPhongMaterial(),
                line: this.getLineMaterial()
              };
              instanceObjects = [];
              _context4.next = 4;
              return this.walkVisTreeGen3DObjs(instance, materials);
            case 4:
              threeDeeObjList = _context4.sent;
              if (threeDeeObjList.length > 1) {
                mergedObjs = this.merge3DObjects(threeDeeObjList, materials); // investigate need to obj.dispose for obj in threeDeeObjList
                if (mergedObjs != null) {
                  mergedObjs.instancePath = instance.getInstancePath();
                  instanceObjects.push(mergedObjs);
                } else {
                  for (obj in threeDeeObjList) {
                    threeDeeObjList[obj].instancePath = instance.getInstancePath();
                    instanceObjects.push(threeDeeObjList[obj]);
                  }
                }
              } else if (threeDeeObjList.length === 1) {
                // only one object in list, add it to local array and set
                instanceObjects.push(threeDeeObjList[0]);
                instanceObjects[0].instancePath = instance.getInstancePath();
              }
              return _context4.abrupt("return", instanceObjects);
            case 7:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function generate3DObjects(_x4) {
        return _generate3DObjects.apply(this, arguments);
      }
      return generate3DObjects;
    }()
  }, {
    key: "getMeshPhongMaterial",
    value: function getMeshPhongMaterial(color) {
      if (color === undefined) {
        color = _Resources["default"].COLORS.DEFAULT;
      }
      var material = new this.THREE.MeshPhongMaterial({
        opacity: 1,
        shininess: 10,
        flatShading: false,
        depthWrite: this.depthWrite
      });
      this.setThreeColor(material.color, color);
      material.defaultColor = color;
      material.defaultOpacity = _Resources["default"].OPACITY.DEFAULT;
      material.nowireframe = true;
      return material;
    }
  }, {
    key: "getLineMaterial",
    value: function getLineMaterial(color) {
      if (color === undefined) {
        color = _Resources["default"].COLORS.DEFAULT;
      }
      var material = new this.THREE.LineBasicMaterial({
        depthWrite: this.depthWrite
      });
      this.setThreeColor(material.color, color);
      material.defaultColor = color;
      material.defaultOpacity = _Resources["default"].OPACITY.DEFAULT;
      return material;
    }
  }, {
    key: "setThreeColor",
    value: function setThreeColor(threeColor, color) {
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(color % 1)) {
        // we have an integer (hex) value
        threeColor.setHex(color);
      } else if (Object.prototype.hasOwnProperty.call(color, 'r') && Object.prototype.hasOwnProperty.call(color, 'g') && Object.prototype.hasOwnProperty.call(color, 'b')) {
        threeColor.r = color.r;
        threeColor.g = color.g;
        threeColor.b = color.b;
      } else {
        threeColor.set(color);
      }
    }
  }, {
    key: "walkVisTreeGen3DObjs",
    value: function () {
      var _walkVisTreeGen3DObjs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(instance, materials) {
        var _this = this;
        var visualValue, threeDObj, visualType, threeDObjList;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!(0, _util.hasVisualValue)(instance)) {
                _context6.next = 7;
                break;
              }
              visualValue = instance.getVisualValue();
              _context6.next = 4;
              return this.create3DObjectFromInstance(instance, visualValue, instance.getId(), materials);
            case 4:
              threeDObj = _context6.sent;
              if (!threeDObj) {
                _context6.next = 7;
                break;
              }
              return _context6.abrupt("return", [threeDObj]);
            case 7:
              try {
                visualType = instance.getVisualType();
              } catch (e) {
                visualType = undefined;
              }
              if (!(visualType === undefined)) {
                _context6.next = 12;
                break;
              }
              return _context6.abrupt("return", []);
            case 12:
              if (!visualType.isArray) {
                _context6.next = 19;
                break;
              }
              threeDObjList = [];
              _context6.next = 16;
              return Promise.all(visualType.forEach( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(vt) {
                  return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                    while (1) switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.t0 = threeDObjList;
                        _context5.next = 3;
                        return _this.walkVisTreeGen3DObjsVisualType(vt, instance, materials);
                      case 3:
                        _context5.t1 = _context5.sent;
                        return _context5.abrupt("return", _context5.t0.push.call(_context5.t0, _context5.t1));
                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }, _callee5);
                }));
                return function (_x7) {
                  return _ref.apply(this, arguments);
                };
              }()));
            case 16:
              return _context6.abrupt("return", threeDObjList);
            case 19:
              _context6.next = 21;
              return this.walkVisTreeGen3DObjsVisualType(visualType, instance, materials);
            case 21:
              return _context6.abrupt("return", _context6.sent);
            case 22:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function walkVisTreeGen3DObjs(_x5, _x6) {
        return _walkVisTreeGen3DObjs.apply(this, arguments);
      }
      return walkVisTreeGen3DObjs;
    }()
  }, {
    key: "walkVisTreeGen3DObjsVisualType",
    value: function () {
      var _walkVisTreeGen3DObjsVisualType = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(visualType, instance, materials) {
        var threeDeeObjList, threeDeeObj, v, visualValue, _visualValue, _visualValue2;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              threeDeeObjList = [];
              threeDeeObj = null;
              if (!(visualType.getMetaType() === _Resources["default"].COMPOSITE_VISUAL_TYPE_NODE)) {
                _context7.next = 15;
                break;
              }
              _context7.t0 = _regeneratorRuntime().keys(visualType.getVariables());
            case 4:
              if ((_context7.t1 = _context7.t0()).done) {
                _context7.next = 13;
                break;
              }
              v = _context7.t1.value;
              visualValue = visualType.getVariables()[v].getWrappedObj().initialValues[0].value;
              _context7.next = 9;
              return this.create3DObjectFromInstance(instance, visualValue, visualType.getVariables()[v].getId(), materials);
            case 9:
              threeDeeObj = _context7.sent;
              if (threeDeeObj) {
                threeDeeObjList.push(threeDeeObj);
              }
              _context7.next = 4;
              break;
            case 13:
              _context7.next = 28;
              break;
            case 15:
              if (!(visualType.getMetaType() === _Resources["default"].VISUAL_TYPE_NODE && visualType.getId() === 'particles')) {
                _context7.next = 23;
                break;
              }
              _visualValue = instance.getVariable().getWrappedObj().initialValues[0].value;
              _context7.next = 19;
              return this.create3DObjectFromInstance(instance, _visualValue, instance.getVariable().getId(), materials);
            case 19:
              threeDeeObj = _context7.sent;
              if (threeDeeObj) {
                threeDeeObjList.push(threeDeeObj);
              }
              _context7.next = 28;
              break;
            case 23:
              _visualValue2 = visualType.getWrappedObj().defaultValue;
              _context7.next = 26;
              return this.create3DObjectFromInstance(instance, _visualValue2, visualType.getId(), materials);
            case 26:
              threeDeeObj = _context7.sent;
              if (threeDeeObj) {
                threeDeeObjList.push(threeDeeObj);
              }
            case 28:
              return _context7.abrupt("return", threeDeeObjList);
            case 29:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function walkVisTreeGen3DObjsVisualType(_x8, _x9, _x10) {
        return _walkVisTreeGen3DObjsVisualType.apply(this, arguments);
      }
      return walkVisTreeGen3DObjsVisualType;
    }()
  }, {
    key: "create3DObjectFromInstance",
    value: function () {
      var _create3DObjectFromInstance = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(instance, node, id, materials) {
        var threeObject, lines, material, instancePath;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              threeObject = null;
              lines = this.getDefaultGeometryType() === 'lines';
              material = lines ? materials.line : materials.mesh; // eslint-disable-next-line default-case
              _context8.t0 = node.eClass;
              _context8.next = _context8.t0 === _Resources["default"].PARTICLES ? 6 : _context8.t0 === _Resources["default"].CYLINDER ? 8 : _context8.t0 === _Resources["default"].SPHERE ? 10 : _context8.t0 === _Resources["default"].COLLADA ? 12 : _context8.t0 === _Resources["default"].OBJ ? 14 : _context8.t0 === _Resources["default"].GLTF ? 16 : _context8.t0 === _Resources["default"].DRC ? 20 : 24;
              break;
            case 6:
              threeObject = this.createParticles(node);
              return _context8.abrupt("break", 25);
            case 8:
              if (lines) {
                threeObject = this.create3DLineFromNode(node, material);
              } else {
                threeObject = this.create3DCylinderFromNode(node, material);
              }
              return _context8.abrupt("break", 25);
            case 10:
              if (lines) {
                threeObject = this.create3DLineFromNode(node, material);
              } else {
                threeObject = this.create3DSphereFromNode(node, material);
              }
              return _context8.abrupt("break", 25);
            case 12:
              threeObject = this.loadColladaModelFromNode(node);
              return _context8.abrupt("break", 25);
            case 14:
              threeObject = this.loadThreeOBJModelFromNode(node);
              return _context8.abrupt("break", 25);
            case 16:
              _context8.next = 18;
              return this.loadThreeGLTFModelFromNode(node);
            case 18:
              threeObject = _context8.sent;
              return _context8.abrupt("break", 25);
            case 20:
              _context8.next = 22;
              return this.loadThreeDRCModelFromNode(node);
            case 22:
              threeObject = _context8.sent;
              return _context8.abrupt("break", 25);
            case 24:
              console.error("Invalid node.eClass on node ".concat(node));
            case 25:
              if (threeObject) {
                threeObject.visible = true;
                /*
                 * FIXME: this is empty for collada and obj nodes
                 */
                instancePath = "".concat(instance.getInstancePath(), ".").concat(id);
                threeObject.instancePath = instancePath;
                threeObject.highlighted = false;

                // FIXME: shouldn't that be the vistree? why is it also done at the loadEntity level??
                this.visualModelMap[instancePath] = threeObject;
              }
              return _context8.abrupt("return", threeObject);
            case 27:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function create3DObjectFromInstance(_x11, _x12, _x13, _x14) {
        return _create3DObjectFromInstance.apply(this, arguments);
      }
      return create3DObjectFromInstance;
    }()
  }, {
    key: "getDefaultGeometryType",
    value: function getDefaultGeometryType() {
      var aboveLinesThreshold = this.complexity > this.linesThreshold;
      return aboveLinesThreshold ? 'lines' : 'cylinders';
    }
  }, {
    key: "createParticles",
    value: function createParticles(node) {
      var geometry = new this.THREE.Geometry();
      var threeColor = new this.THREE.Color();
      var color = "0x".concat(Math.floor(Math.random() * 16777215).toString(16));
      threeColor.setHex(color);
      var textureLoader = this.loaders['TextureLoader'];
      var particleTexture = this.particleTexture ? this.particleTexture : textureLoader.load(_particle["default"]);
      var material = new this.THREE.PointsMaterial({
        size: 0.5,
        map: particleTexture,
        blending: this.THREE.NormalBlending,
        depthTest: true,
        transparent: true,
        color: threeColor,
        depthWrite: this.depthWrite
      });
      for (var p = 0; p < node.particles.length; p++) {
        geometry.vertices.push(new this.THREE.Vector3(node.particles[p].x, node.particles[p].y, node.particles[p].z));
      }
      material.defaultColor = color;
      material.defaultOpacity = 1;
      var threeObject = new this.THREE.Points(geometry, material);
      threeObject.visible = true;
      threeObject.instancePath = node.instancePath;
      threeObject.highlighted = false;
      return threeObject;
    }
  }, {
    key: "create3DLineFromNode",
    value: function create3DLineFromNode(node, material) {
      var threeObject = null;
      if (node.eClass === _Resources["default"].CYLINDER) {
        var bottomBasePos = new this.THREE.Vector3(node.position.x, node.position.y, node.position.z);
        var topBasePos = new this.THREE.Vector3(node.distal.x, node.distal.y, node.distal.z);
        var axis = new this.THREE.Vector3();
        axis.subVectors(topBasePos, bottomBasePos);
        var midPoint = new this.THREE.Vector3();
        midPoint.addVectors(bottomBasePos, topBasePos).multiplyScalar(0.5);
        var geometry = new this.THREE.Geometry();
        geometry.vertices.push(bottomBasePos);
        geometry.vertices.push(topBasePos);
        threeObject = new this.THREE.Line(geometry, material);
        threeObject.applyMatrix(new this.THREE.Matrix4().makeTranslation(0, axis.length() / 2, 0));
        threeObject.applyMatrix(new this.THREE.Matrix4().makeRotationY(Math.PI / 2));
        threeObject.lookAt(axis);
        threeObject.position.fromArray(bottomBasePos.toArray());
        threeObject.applyMatrix(new this.THREE.Matrix4().makeRotationY(-Math.PI / 2));
        threeObject.geometry.verticesNeedUpdate = true;
      } else if (node.eClass === _Resources["default"].SPHERE) {
        var sphere = new this.THREE.SphereGeometry(node.radius, 20, 20);
        threeObject = new this.THREE.Mesh(sphere, material);
        threeObject.position.set(node.position.x, node.position.y, node.position.z);
        threeObject.geometry.verticesNeedUpdate = true;
      }
      return threeObject;
    }
  }, {
    key: "create3DSphereFromNode",
    value: function create3DSphereFromNode(sphereNode, material) {
      var sphere = new this.THREE.SphereGeometry(sphereNode.radius, 20, 20);
      // sphere.applyMatrix(new this.THREE.Matrix4().makeScale(-1,1,1));
      var threeObject = new this.THREE.Mesh(sphere, material);
      threeObject.position.set(sphereNode.position.x, sphereNode.position.y, sphereNode.position.z);
      return threeObject;
    }
  }, {
    key: "create3DCylinderFromNode",
    value: function create3DCylinderFromNode(cylNode, material) {
      var bottomBasePos = new this.THREE.Vector3(cylNode.position.x, cylNode.position.y, cylNode.position.z);
      var topBasePos = new this.THREE.Vector3(cylNode.distal.x, cylNode.distal.y, cylNode.distal.z);
      var axis = new this.THREE.Vector3();
      axis.subVectors(topBasePos, bottomBasePos);
      var c = new this.THREE.CylinderGeometry(cylNode.topRadius, cylNode.bottomRadius, axis.length(), 20, 1, false);

      // shift it so one end rests on the origin
      c.applyMatrix(new this.THREE.Matrix4().makeTranslation(0, axis.length() / 2, 0));
      // rotate it the right way for lookAt to work
      c.applyMatrix(new this.THREE.Matrix4().makeRotationX(Math.PI / 2));
      // make a mesh with the geometry
      var threeObject = new this.THREE.Mesh(c, material);
      // make it point to where we want
      threeObject.lookAt(axis);
      // move base
      threeObject.position.fromArray(bottomBasePos.toArray());
      threeObject.geometry.verticesNeedUpdate = true;
      return threeObject;
    }

    // TODO: Collada example
  }, {
    key: "loadColladaModelFromNode",
    value: function loadColladaModelFromNode(node) {
      var loader = this.loaders[_Resources["default"].COLLADA];
      loader.options.convertUpAxis = true;
      var scene = null;
      var that = this;
      loader.parse(node.collada, function (collada) {
        // eslint-disable-next-line prefer-destructuring
        scene = collada.scene;
        scene.traverse(function (child) {
          if (child instanceof that.THREE.Mesh) {
            child.material.defaultColor = _Resources["default"].COLORS.DEFAULT;
            child.material.defaultOpacity = _Resources["default"].OPACITY.DEFAULT;
            child.material.wireframe = that.wireframe;
            child.material.opacity = _Resources["default"].OPACITY.DEFAULT;
            child.geometry.computeVertexNormals();
          }
          if (child instanceof that.THREE.SkinnedMesh) {
            child.material.skinning = true;
            child.material.defaultColor = _Resources["default"].COLORS.DEFAULT;
            child.material.defaultOpacity = _Resources["default"].OPACITY.DEFAULT;
            child.material.wireframe = that.wireframe;
            child.material.opacity = _Resources["default"].OPACITY.DEFAULT;
            child.geometry.computeVertexNormals();
          }
        });
      });
      return scene;
    }
  }, {
    key: "loadThreeOBJModelFromNode",
    value: function loadThreeOBJModelFromNode(node) {
      var loader = this.loaders[_Resources["default"].OBJ];
      var textureLoader = this.loaders['TextureLoader'];
      var particleTexture = this.particleTexture ? this.particleTexture : textureLoader.load(_particle["default"]);
      var scene = loader.parse(this.parseBase64(node.obj), particleTexture);
      var that = this;
      scene.traverse(function (child) {
        if (child instanceof that.THREE.Mesh) {
          that.setThreeColor(child.material.color, _Resources["default"].COLORS.DEFAULT);
          child.material.wireframe = that.wireframe;
          child.material.defaultColor = _Resources["default"].COLORS.DEFAULT;
          child.material.defaultOpacity = _Resources["default"].OPACITY.DEFAULT;
          child.material.opacity = _Resources["default"].OPACITY.DEFAULT;
          child.geometry.computeVertexNormals();
        }
      });
      return scene;
    }
  }, {
    key: "loadThreeGLTFModelFromNode",
    value: function () {
      var _loadThreeGLTFModelFromNode = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(node) {
        var loader, gltfData, that;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              loader = this.loaders[_Resources["default"].GLTF];
              _context9.next = 3;
              return this.modelParser(loader, this.parseBase64(node.gltf));
            case 3:
              gltfData = _context9.sent;
              if (gltfData.scene.children.length === 1) {
                that = this;
                gltfData.scene.children[0].traverse(function (child) {
                  if (child instanceof that.THREE.Mesh) {
                    that.setThreeColor(child.material.color, _Resources["default"].COLORS.DEFAULT);
                    child.material.wireframe = that.wireframe;
                    child.material.defaultColor = _Resources["default"].COLORS.DEFAULT;
                    child.material.defaultOpacity = _Resources["default"].OPACITY.DEFAULT;
                    child.material.opacity = _Resources["default"].OPACITY.DEFAULT;
                    child.geometry.computeVertexNormals();
                  }
                });
              } else {
                console.error("GEPPETTO Error - GLTF loaded more than one object in the scene.");
              }
              return _context9.abrupt("return", gltfData.scene.children[0]);
            case 6:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function loadThreeGLTFModelFromNode(_x15) {
        return _loadThreeGLTFModelFromNode.apply(this, arguments);
      }
      return loadThreeGLTFModelFromNode;
    }()
  }, {
    key: "loadThreeDRCModelFromNode",
    value: function () {
      var _loadThreeDRCModelFromNode = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(node) {
        var dracoLoader, geometry;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              dracoLoader = this.loaders[_Resources["default"].DRC];
              _context10.next = 3;
              return this.modelLoader(dracoLoader, node.drc);
            case 3:
              geometry = _context10.sent;
              geometry.computeVertexNormals();
              return _context10.abrupt("return", new this.THREE.Mesh(geometry, this.getMeshPhongMaterial()));
            case 6:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function loadThreeDRCModelFromNode(_x16) {
        return _loadThreeDRCModelFromNode.apply(this, arguments);
      }
      return loadThreeDRCModelFromNode;
    }()
  }, {
    key: "parseBase64",
    value: function parseBase64(str) {
      try {
        return atob(str.split('base64,')[1]);
      } catch (e) {
        return str;
      }
    }
  }, {
    key: "modelLoader",
    value: function modelLoader(loader, url) {
      return new Promise(function (resolve, reject) {
        loader.load(url, function (data) {
          return resolve(data);
        }, null, reject);
      });
    }
  }, {
    key: "modelParser",
    value: function () {
      var _modelParser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(loader, data) {
        var results;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return new Promise(function (resolve, reject) {
                loader.parse(data, null, function (data) {
                  return resolve(data);
                }, reject);
              });
            case 2:
              results = _context11.sent;
              return _context11.abrupt("return", results);
            case 4:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function modelParser(_x17, _x18) {
        return _modelParser.apply(this, arguments);
      }
      return modelParser;
    }()
  }, {
    key: "init3DObject",
    value: function init3DObject(meshes, instance) {
      var instancePath = instance.getInstancePath();
      var position = instance.getPosition();
      for (var m in meshes) {
        var mesh = meshes[m];
        mesh.instancePath = instancePath;
        /*
        * if the model file is specifying a position for the loaded meshes then we translate them here
        */
        if (position != null) {
          mesh.position.set(position.x, position.y, position.z);
        }
        this.meshes[instancePath] = mesh;
        this.meshes[instancePath].visible = true;
        this.meshes[instancePath].defaultOpacity = 1;
        this.meshes[instancePath].input = false;
        this.meshes[instancePath].output = false;

        // Split anything that was splitted before
        if (instancePath in this.splitMeshes) {
          var splitMeshes = this.splitMeshes;
          var elements = {};
          for (var splitMesh in splitMeshes) {
            if (splitMeshes[splitMesh].instancePath === instancePath && splitMesh !== instancePath) {
              var visualObject = splitMesh.substring(instancePath.length + 1);
              elements[visualObject] = '';
            }
          }
          if (Object.keys(elements).length > 0) {
            this.splitGroups(instance, elements);
          }
        }
        this.calculateSceneMaxRadius(mesh);
        this.calculateSceneComplexity(mesh);
      }
    }
  }, {
    key: "merge3DObjects",
    value: function merge3DObjects(objArray, materials) {
      var mergedMeshesPaths = [];
      var ret = null;
      var mergedLines;
      var mergedMeshes;
      var that = this;
      objArray.forEach(function (obj) {
        if (obj instanceof that.THREE.Line) {
          if (mergedLines === undefined) {
            mergedLines = new that.THREE.Geometry();
          }
          mergedLines.vertices.push(obj.geometry.vertices[0]);
          mergedLines.vertices.push(obj.geometry.vertices[1]);
        } else if (obj.geometry.type === 'Geometry') {
          // This catches both Collada an OBJ
          if (objArray.length > 1) {
            throw Error('Merging of multiple OBJs or Colladas not supported');
          } else {
            ret = obj;
          }
        } else {
          if (mergedMeshes === undefined) {
            mergedMeshes = new that.THREE.Geometry();
          }
          obj.geometry.dynamic = true;
          obj.geometry.verticesNeedUpdate = true;
          obj.updateMatrix();
          mergedMeshes.merge(obj.geometry, obj.matrix);
        }
        mergedMeshesPaths.push(obj.instancePath);
      });
      if (mergedLines === undefined) {
        /*
         * There are no line geometries, we just create a mesh for the merge of the solid geometries
         * and apply the mesh material
         */
        ret = new that.THREE.Mesh(mergedMeshes, materials.mesh);
      } else {
        ret = new that.THREE.LineSegments(mergedLines, materials.line);
        if (mergedMeshes !== undefined) {
          // we merge into a single mesh both types of geometries (from lines and 3D objects)
          var tempmesh = new that.THREE.Mesh(mergedMeshes, materials.mesh);
          ret.geometry.merge(tempmesh.geometry, tempmesh.matrix);
        }
      }
      if (ret != null && !Array.isArray(ret)) {
        ret.mergedMeshesPaths = mergedMeshesPaths;
      }
      return ret;
    }

    /**
     * Split merged mesh into individual meshes
     *
     *            instance - original instance
     *            groups - The groups that we need to split mesh into
     * @param instance
     * @param groupElements
     */
  }, {
    key: "splitGroups",
    value: function splitGroups(instance, groupElements) {
      if (!this.hasMesh(instance)) {
        return;
      }
      var instancePath = instance.getInstancePath();

      // retrieve the merged mesh
      var mergedMesh = this.meshes[instancePath];
      // create object to hold geometries used for merging objects in groups
      var geometryGroups = {};

      /*
       * reset the aspect instance path group mesh, this is used to group visual objects that don't belong to any of the groups passed as parameter
       */
      this.splitMeshes[instancePath] = null;
      geometryGroups[instancePath] = new this.THREE.Geometry();

      // create map of geometry groups for groups
      for (var groupElement in groupElements) {
        var groupName = "".concat(instancePath, ".").concat(groupElement);
        var geometry = new this.THREE.Geometry();
        geometry.groupMerge = true;
        geometryGroups[groupName] = geometry;
      }

      // get map of all meshes that merged mesh was merging
      var map = mergedMesh.mergedMeshesPaths;

      /*
       * flag for keep track what visual objects were added to group
       * meshes already
       */
      var added = false;
      /*
       * loop through individual meshes, add them to group, set new
       * material to them
       */

      for (var v in map) {
        if (v !== undefined) {
          var m = this.visualModelMap[map[v]];

          // eslint-disable-next-line no-eval
          Instances.getInstance(map[v].substring(0, map[v].lastIndexOf('.')));
          var object = instance.getVisualType()[map[v].replace("".concat(instancePath, "."), '')];

          // If it is a segment compare to the id otherwise check in the visual groups
          if (object.getId() in groupElements) {
            // true means don't add to mesh with non-groups visual objects
            added = this.addMeshToGeometryGroup(instance, object.getId(), geometryGroups, m);
          } else {
            // get group elements list for object
            var groupElementsReference = object.getInitialValue().value.groupElements;
            for (var i = 0; i < groupElementsReference.length; i++) {
              var objectGroup = _ModelFactory["default"].resolve(groupElementsReference[i].$ref).getId();
              if (objectGroup in groupElements) {
                // true means don't add to mesh with non-groups visual objects
                added = this.addMeshToGeometryGroup(instance, objectGroup, geometryGroups, m);
              }
            }
          }

          /*
           * if visual object didn't belong to group, add it to mesh
           * with remainder of them
           */
          if (!added) {
            var _geometry = geometryGroups[instancePath];
            if (m instanceof this.THREE.Line) {
              _geometry.vertices.push(m.geometry.vertices[0]);
              _geometry.vertices.push(m.geometry.vertices[1]);
            } else {
              // merged mesh into corresponding geometry
              _geometry.merge(m.geometry, m.matrix);
            }
          }
          // reset flag for next visual object
          added = false;
        }
      }
      groupElements[instancePath] = {};
      groupElements[instancePath].color = _Resources["default"].COLORS.SPLIT;
      this.createGroupMeshes(instancePath, geometryGroups, groupElements);
    }

    /**
     * Add mesh to geometry groups
     *
     *            instancePath - Path of aspect, corresponds to original merged mesh
     *            id - local path to the group
     *            groups - The groups that we need to split mesh into
     *            m - current mesh
     * @param instance
     * @param id
     * @param geometryGroups
     * @param m
     */
  }, {
    key: "addMeshToGeometryGroup",
    value: function addMeshToGeometryGroup(instance, id, geometryGroups, m) {
      if (!this.hasMesh(instance)) {
        return;
      }
      // name of group, mix of aspect path and group name
      var groupName = "".concat(instance.getInstancePath(), ".").concat(id);
      // retrieve corresponding geometry for this group
      var geometry = geometryGroups[groupName];
      // only merge if flag is set to true
      if (m instanceof this.THREE.Line) {
        geometry.vertices.push(m.geometry.vertices[0]);
        geometry.vertices.push(m.geometry.vertices[1]);
      } else {
        // merged mesh into corresponding geometry
        geometry.merge(m.geometry, m.matrix);
      }
      // eslint-disable-next-line consistent-return
      return true;
    }

    /**
     * Create group meshes for given groups, retrieves from map if already present
     * @param instancePath
     * @param geometryGroups
     * @param groups
     */
  }, {
    key: "createGroupMeshes",
    value: function createGroupMeshes(instancePath, geometryGroups, groups) {
      if (!this.hasMesh(instancePath)) {
        return;
      }
      var mergedMesh = this.meshes[instancePath];
      // switch visible flag to false for merged mesh and remove from scene
      mergedMesh.visible = false;
      for (var g in groups) {
        var groupName = g;
        if (groupName.indexOf(instancePath) <= -1) {
          groupName = "".concat(instancePath, ".").concat(g);
        }
        var groupMesh = this.splitMeshes[groupName];
        var geometryGroup = geometryGroups[groupName];
        if (mergedMesh instanceof this.THREE.Line) {
          var material = this.getLineMaterial();
          groupMesh = new this.THREE.LineSegments(geometryGroup, material);
        } else {
          var _material = this.getMeshPhongMaterial();
          groupMesh = new this.THREE.Mesh(geometryGroup, _material);
        }
        groupMesh.instancePath = instancePath;
        groupMesh.geometryIdentifier = g;
        groupMesh.geometry.dynamic = false;
        groupMesh.position.copy(mergedMesh.position);
        this.splitMeshes[groupName] = groupMesh;

        // add split mesh to scenne and set flag to visible
        groupMesh.visible = true;
      }
    }

    /**
     * Changes the color of a given instance
     *
     * @param instancePath
     * @param color
     */
  }, {
    key: "setColor",
    value: function setColor(instancePath, color) {
      var _this2 = this;
      if (!this.hasMesh(instancePath)) {
        return;
      }
      var meshes = this.getRealMeshesForInstancePath(instancePath);
      if (meshes.length > 0) {
        var _loop = function _loop() {
          var mesh = meshes[i];
          if (mesh) {
            var that = _this2;
            mesh.traverse(function (object) {
              if (Object.prototype.hasOwnProperty.call(object, 'material')) {
                that.setThreeColor(object.material.color, color);
                object.material.defaultColor = color;
                if (color.a) {
                  object.material.transparent = true;
                  object.material.opacity = color.a;
                }
              }
            });
          }
        };
        for (var i = 0; i < meshes.length; i++) {
          _loop();
        }
      }
    }

    /**
     * Get Meshes associated to an instance
     *
     *            instancePath - Path of the instance
     * @param instancePath
     */
  }, {
    key: "getRealMeshesForInstancePath",
    value: function getRealMeshesForInstancePath(instancePath) {
      var meshes = [];
      if (instancePath in this.splitMeshes) {
        for (var keySplitMeshes in this.splitMeshes) {
          if (keySplitMeshes.startsWith(instancePath)) {
            meshes.push(this.splitMeshes[keySplitMeshes]);
          }
        }
      } else if (instancePath in this.meshes) {
        meshes.push(this.meshes[instancePath]);
      }
      return meshes;
    }

    /**
     * Checks if instance has a mesh
     *
     * @param instance
     */
  }, {
    key: "hasMesh",
    value: function hasMesh(instance) {
      var instancePath = typeof instance == 'string' ? instance : instance.getInstancePath();
      return this.meshes[instancePath] !== undefined;
    }

    /**
     * Traverse through THREE object to calculate that complexity (ammount of 3d objects)
     * with this and calculateSceneMaxRadius, we can estimate how dense the scene is to implement any wanted optimization behavior
     * @param object
     */
  }, {
    key: "calculateSceneComplexity",
    value: function calculateSceneComplexity(object) {
      var currentComplexity = 0;
      if (object.children.length > 0) {
        for (var i = 0; i < object.children.length; i++) {
          if (object.children[i] !== undefined) {
            this.calculateSceneComplexity(object.children[i]);
          }
        }
      } else {
        if (Object.prototype.hasOwnProperty.call(object, 'geometry')) {
          currentComplexity++;
        }
      }
      this.complexity += currentComplexity;
    }

    /**
     * Traverse through THREE object to calculate that maximun radius based
     * on bounding sphere of visible objects
     * @param object
     */
  }, {
    key: "calculateSceneMaxRadius",
    value: function calculateSceneMaxRadius(object) {
      var currentRadius = 0;
      if (object.children.length > 0) {
        for (var i = 0; i < object.children.length; i++) {
          if (object.children[i] !== undefined) {
            this.calculateSceneMaxRadius(object.children[i]);
          }
        }
      } else {
        if (Object.prototype.hasOwnProperty.call(object, 'geometry')) {
          object.geometry.computeBoundingSphere();
          currentRadius = object.geometry.boundingSphere.radius;
        }
      }
      if (currentRadius > this.sceneMaxRadius) {
        this.sceneMaxRadius = currentRadius;
      }
    }

    /**
     * Calculates linePrecision used by raycaster when picking objects.
     */
  }, {
    key: "getLinePrecision",
    value: function getLinePrecision() {
      this.rayCasterLinePrecision = this.sceneMaxRadius / this.linePrecisionMinRadius;
      if (this.rayCasterLinePrecision < this.minAllowedLinePrecision) {
        this.rayCasterLinePrecision = this.minAllowedLinePrecision;
      }
      this.rayCasterLinePrecision = Math.round(this.rayCasterLinePrecision);
      return this.rayCasterLinePrecision;
    }
  }, {
    key: "cleanWith3DObject",
    value: function cleanWith3DObject(instance) {
      for (var _i = 0, _Object$keys = Object.keys(this.meshes); _i < _Object$keys.length; _i++) {
        var meshKey = _Object$keys[_i];
        if (this.meshes[meshKey].uuid === instance.uuid) {
          delete this.meshes[meshKey];
        }
      }
    }
  }, {
    key: "clean",
    value: function clean() {
      this.meshes = {};
      this.splitMeshes = {};
      this.visualModelMap = {};
      this.complexity = 0;
      this.sceneMaxRadius = 0;
    }
  }, {
    key: "setParticleTexture",
    value: function setParticleTexture(particleTexture) {
      this.particleTexture = particleTexture;
    }

    /**
     * Sets linesThreshold
     */
  }, {
    key: "setLinesThreshold",
    value: function setLinesThreshold(linesThreshold) {
      this.linesThreshold = linesThreshold;
    }
  }]);
}();
//# sourceMappingURL=MeshFactory.js.map