"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  MINIMIZED_PANEL: true,
  getLayoutManagerInstance: true,
  initLayoutManager: true
};
exports.MINIMIZED_PANEL = void 0;
Object.defineProperty(exports, "getLayoutManagerInstance", {
  enumerable: true,
  get: function get() {
    return _LayoutManager.getLayoutManagerInstance;
  }
});
Object.defineProperty(exports, "initLayoutManager", {
  enumerable: true,
  get: function get() {
    return _LayoutManager.initLayoutManager;
  }
});
var _actions = require("./actions");
Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _actions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});
var _reducer = require("./reducer");
Object.keys(_reducer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _reducer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reducer[key];
    }
  });
});
var _LayoutManager = require("./LayoutManager");
var MINIMIZED_PANEL = "border_bottom";
exports.MINIMIZED_PANEL = MINIMIZED_PANEL;
//# sourceMappingURL=index.js.map