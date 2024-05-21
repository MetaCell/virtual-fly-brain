"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.init = init;
var _urlJoin = _interopRequireDefault(require("url-join"));
var _MessageSocket = _interopRequireDefault(require("./communication/MessageSocket"));
var _Events = _interopRequireDefault(require("./Events"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Geppetto entry point
 *
 */

/**
 *
 */
function createChannel() {
  // Change link from blank to self for GEPPETTO_CONFIGURATION.embedded environments
  if (GEPPETTO_CONFIGURATION.embedded && GEPPETTO_CONFIGURATION.embedderURL !== "/" && typeof handleRequest == 'undefined') {
    if ($.isArray(GEPPETTO_CONFIGURATION.embedderURL)) {
      window.parent.postMessage({
        "command": "ready"
      }, GEPPETTO_CONFIGURATION.embedderURL[0]);
    } else {
      window.parent.postMessage({
        "command": "ready"
      }, GEPPETTO_CONFIGURATION.embedderURL);
    }
  }
}

/**
 * Initialize web socket communication
 */
function init() {
  if (GEPPETTO_CONFIGURATION.contextPath == "/") {
    var host = (0, _urlJoin["default"])(_MessageSocket["default"].protocol + window.location.host.replace("8081", "8080"), '/GeppettoServlet');
  } else {
    var baseHost = _MessageSocket["default"].protocol + window.location.host;
    var contextPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
    if (!contextPath.endsWith(GEPPETTO_CONFIGURATION.contextPath.replace(/^\/|\/$/g, ''))) {
      contextPath = (0, _urlJoin["default"])(contextPath, GEPPETTO_CONFIGURATION.contextPath);
    }
    var host = (0, _urlJoin["default"])(baseHost, contextPath, "GeppettoServlet");
  }
  _MessageSocket["default"].connect(host);
  console.log("Host for MessageSocket to connect: " + host);
  _Events["default"].listen();
  createChannel();
  _MessageSocket["default"].send("geppetto_version", null);
}
var _default = {
  init: init
};
exports["default"] = _default;
//# sourceMappingURL=WebsocketMain.js.map