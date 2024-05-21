"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
exports["default"] = void 0;
var redux = _interopRequireWildcard(require("redux"));
var _geppettoMiddleware = require("./middleware/geppettoMiddleware");
var _LayoutManager = require("./layout/LayoutManager");
var _EventManager = _interopRequireDefault(require("./EventManager"));
var _geppettoLayout = require("./reducer/geppettoLayout");
var _geppettoClient = _interopRequireWildcard(require("./reducer/geppettoClient"));
var _reducerDecorator = require("./reducer/reducerDecorator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var initialState = {
  client: _geppettoClient.clientInitialState,
  layout: _geppettoLayout.layoutInitialState,
  widgets: {}
};
var staticReducers = {
  client: _geppettoClient["default"],
  layout: _geppettoLayout.layout,
  widgets: _geppettoLayout.widgets
};

// Use the below for redux debugging with stack trace
//const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true, traceLimit: 25}) || redux.compose;
var storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
function createStore(reducers, state, enhancers) {
  var layout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    componentMap: {}
  };
  var layoutManager = (0, _LayoutManager.initLayoutManager)(layout.baseLayout || _geppettoLayout.layoutInitialState, layout.componentMap, layout.iconFactory, layout.isMinimizeEnabled || false);
  var allMiddlewares = [].concat(_toConsumableArray(enhancers), [_geppettoMiddleware.callbacksMiddleware, layoutManager.middleware]);
  var store = redux.createStore((0, _reducerDecorator.reducerDecorator)(redux.combineReducers(_objectSpread(_objectSpread({}, staticReducers), reducers))), _objectSpread(_objectSpread({}, initialState), state), storeEnhancers(redux.applyMiddleware.apply(redux, _toConsumableArray(allMiddlewares))));
  _EventManager["default"].setStore(store);
  return store;
}
var _default = createStore;
exports["default"] = _default;
//# sourceMappingURL=store.js.map